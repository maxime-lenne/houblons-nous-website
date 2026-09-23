#!/usr/bin/env bun
// Re-sync develop with main after a release: rebase develop onto main and
// force-push it (with lease). Rebase merges into main rewrite SHAs and the
// release adds a 🔖 Release commit, so develop must be rebased before the next
// develop → main PR. Commits already on main (same content) are dropped.
//
// Usage:
//   bun run sync:develop          # locally, with your git credentials
//   SYNC_REMOTE=<url> bun scripts/sync-develop.js
//     used by release.yml with an authenticated URL (RELEASE_TOKEN)
//
// Requires force pushes to be allowed on develop (.github/settings.yml).

const remote = process.env.SYNC_REMOTE || 'origin';

function git(...args) {
  const result = Bun.spawnSync(['git', ...args], { stdout: 'pipe', stderr: 'pipe' });
  return { ok: result.success, out: result.stdout.toString().trim(), err: result.stderr.toString().trim() };
}

function run(...args) {
  const result = git(...args);
  if (!result.ok) {
    console.error(`git ${args[0]} failed: ${result.err}`);
    process.exit(1);
  }
  return result.out;
}

run('fetch', '--quiet', remote,
  '+refs/heads/main:refs/remotes/sync/main',
  '+refs/heads/develop:refs/remotes/sync/develop');

if (git('merge-base', '--is-ancestor', 'sync/main', 'sync/develop').ok) {
  console.log('develop already contains main: nothing to do');
  process.exit(0);
}

const lease = run('rev-parse', 'sync/develop');
const previous = git('branch', '--show-current').out;
run('checkout', '--quiet', '-B', 'develop', 'sync/develop');

if (!git('rebase', 'sync/main').ok) {
  git('rebase', '--abort');
  console.error('Conflict while rebasing develop onto main: resolve it manually:');
  console.error('  git switch develop && git fetch origin && git rebase origin/main');
  console.error('  git push --force-with-lease origin develop');
  process.exit(1);
}

run('push', `--force-with-lease=develop:${lease}`, remote, 'develop:develop');
console.log(`develop rebased onto main (${run('rev-parse', '--short', 'sync/main')}) and pushed`);

if (previous && previous !== 'develop') run('checkout', '--quiet', previous);
