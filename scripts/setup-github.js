#!/usr/bin/env bun
// Apply .github/settings.yml to the GitHub repository. Idempotent: safe to re-run.
//
// Usage:
//   bun run setup:github                      # apply everything
//   bun run setup:github --dry-run            # show what would change
//   bun run setup:github --only=labels,protection
//
// Sections: branches, repository, security, labels, protection, secrets
// Secrets: RELEASE_TOKEN is stored as a repository secret when set in the env
//   RELEASE_TOKEN=<admin PAT> bun run setup:github --only=secrets
// Auth: GH_TOKEN or GITHUB_TOKEN env var, otherwise the local `gh` CLI session.
// Repository settings, security and protection require admin rights.

const SECTIONS = ['branches', 'repository', 'security', 'labels', 'protection', 'secrets'];
// Repository secrets copied from the environment when present
const SECRETS = ['RELEASE_TOKEN'];
const SECURITY_KEYS = ['enable_vulnerability_alerts', 'enable_automated_security_fixes'];
const API = 'https://api.github.com';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyArg = args.find(arg => arg.startsWith('--only='));
const sections = onlyArg ? onlyArg.slice('--only='.length).split(',') : SECTIONS;

const unknown = sections.filter(section => !SECTIONS.includes(section));
if (unknown.length > 0) {
  console.error(`Unknown section(s): ${unknown.join(', ')}. Valid: ${SECTIONS.join(', ')}`);
  process.exit(1);
}

function gh(...ghArgs) {
  const result = Bun.spawnSync(['gh', ...ghArgs], { stderr: 'pipe' });
  if (!result.success) {
    throw new Error(`gh ${ghArgs.join(' ')} failed: ${result.stderr.toString().trim()}`);
  }
  return result.stdout.toString().trim();
}

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || gh('auth', 'token');
const repo = process.env.GITHUB_REPOSITORY
  || gh('repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner');
const settings = Bun.YAML.parse(await Bun.file('.github/settings.yml').text());

let warnings = 0;
let errors = 0;
const log = {
  ok: message => console.log(`  ✔ ${message}`),
  plan: message => console.log(`  ~ ${message} (dry run)`),
  warn: message => { warnings++; console.log(`  ⚠ ${message}`); },
  error: message => { errors++; console.log(`  ✖ ${message}`); },
};

async function api(method, path, body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null };
}

// Read calls always run; write calls are skipped in dry-run mode.
async function write(method, path, body, description) {
  if (dryRun) {
    log.plan(description);
    return { status: 0 };
  }
  const response = await api(method, path, body);
  if (response.status >= 400) {
    const message = response.data?.message ?? `HTTP ${response.status}`;
    return { ...response, error: `${description}: ${message}` };
  }
  log.ok(description);
  return response;
}

async function setupBranches() {
  const { data: repository } = await api('GET', `/repos/${repo}`);
  const { data: head } = await api('GET', `/repos/${repo}/git/ref/heads/${repository.default_branch}`);
  const names = new Set([
    ...(settings.branches ?? []).map(branch => branch.name),
    settings.repository?.default_branch,
  ].filter(Boolean));

  for (const name of names) {
    // fetch follows redirects (renamed branches): compare the returned name
    const { status, data } = await api('GET', `/repos/${repo}/branches/${name}`);
    if (status === 200 && data.name === name) {
      log.ok(`branch ${name} exists`);
      continue;
    }
    const result = await write('POST', `/repos/${repo}/git/refs`,
      { ref: `refs/heads/${name}`, sha: head.object.sha },
      `create branch ${name} from ${repository.default_branch}`);
    if (result.error) log.error(result.error);
  }
}

async function setupRepository() {
  const fields = Object.fromEntries(
    Object.entries(settings.repository ?? {}).filter(([key]) => !SECURITY_KEYS.includes(key)),
  );
  const result = await write('PATCH', `/repos/${repo}`, fields,
    `repository settings (${Object.keys(fields).join(', ')})`);
  if (result.error) {
    log.error(result.error);
    return;
  }
  // GitHub silently ignores some settings depending on the plan
  // (e.g. allow_auto_merge on a private repository with GitHub Free)
  for (const [key, value] of Object.entries(fields)) {
    if (result.data && key in result.data && result.data[key] !== value) {
      log.warn(`${key} is ${result.data[key]} instead of ${value}: not available for this repository or plan`);
    }
  }
}

async function setupSecurity() {
  const toggles = [
    ['enable_vulnerability_alerts', 'vulnerability-alerts', 'vulnerability alerts'],
    ['enable_automated_security_fixes', 'automated-security-fixes', 'Dependabot security updates'],
  ];
  for (const [key, endpoint, label] of toggles) {
    const enabled = settings.repository?.[key];
    if (enabled === undefined) continue;
    const result = await write(enabled ? 'PUT' : 'DELETE', `/repos/${repo}/${endpoint}`, undefined,
      `${enabled ? 'enable' : 'disable'} ${label}`);
    if (result.error) log.error(result.error);
  }
}

async function setupLabels() {
  const { data: existing } = await api('GET', `/repos/${repo}/labels?per_page=100`);
  const byName = new Map(existing.map(label => [label.name.toLowerCase(), label]));

  for (const { name, color, description = '' } of settings.labels ?? []) {
    const current = byName.get(name.toLowerCase());
    // Unquoted all-digit colors (e.g. 008672) are parsed by YAML as numbers
    const hex = String(color).replace('#', '').padStart(6, '0').toLowerCase();
    if (!current) {
      const result = await write('POST', `/repos/${repo}/labels`, { name, color: hex, description },
        `create label ${name}`);
      if (result.error) log.error(result.error);
    } else if (current.name !== name || current.color !== hex || (current.description ?? '') !== description) {
      const result = await write('PATCH', `/repos/${repo}/labels/${encodeURIComponent(current.name)}`,
        { new_name: name, color: hex, description }, `update label ${name}`);
      if (result.error) log.error(result.error);
    }
  }
  log.ok(`${(settings.labels ?? []).length} labels checked`);
}

async function setupProtection() {
  for (const { name, protection } of settings.branches ?? []) {
    const body = structuredClone(protection);
    const reviews = body.required_pull_request_reviews;
    const restrictions = reviews?.dismissal_restrictions;
    // Dismissal restrictions are only accepted on organization repositories
    if (restrictions && !restrictions.users?.length && !restrictions.teams?.length) {
      delete reviews.dismissal_restrictions;
    }
    body.restrictions ??= null;

    const result = await write('PUT', `/repos/${repo}/branches/${name}/protection`, body,
      `protect branch ${name}`);
    if (result.status === 403) {
      // Usually: private repository on GitHub Free (needs a public repository or Pro/Team)
      log.warn(`${result.error} (private repositories need GitHub Pro/Team)`);
    } else if (result.error) {
      log.error(result.error);
    }
  }
}

async function setupSecrets() {
  for (const name of SECRETS) {
    const value = process.env[name];
    if (!value) {
      log.warn(`${name} not set in the environment: secret left unchanged`);
      continue;
    }
    if (dryRun) {
      log.plan(`set secret ${name}`);
      continue;
    }
    // The value goes through stdin, never through the command line
    const result = Bun.spawnSync(['gh', 'secret', 'set', name, '--repo', repo], {
      stdin: new TextEncoder().encode(value),
      stderr: 'pipe',
      env: { ...process.env, GH_TOKEN: token },
    });
    if (result.success) {
      log.ok(`set secret ${name}`);
    } else {
      log.error(`set secret ${name}: ${result.stderr.toString().trim()}`);
    }
  }
}

const handlers = {
  branches: setupBranches,
  repository: setupRepository,
  security: setupSecurity,
  labels: setupLabels,
  protection: setupProtection,
  secrets: setupSecrets,
};

console.log(`Applying .github/settings.yml to ${repo}${dryRun ? ' (dry run)' : ''}`);
for (const section of SECTIONS.filter(section => sections.includes(section))) {
  console.log(`\n${section}`);
  await handlers[section]();
}

console.log(`\nDone: ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
