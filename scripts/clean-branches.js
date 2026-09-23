#!/usr/bin/env bun
// Delete local branches whose PR was merged: the remote branch is gone
// (deleted on merge) and all their commits are in origin/develop or
// origin/main. Commits are compared by content (`git cherry`), since rebase
// merges rewrite SHAs and `git branch --merged` cannot detect them.
//
// Usage:
//   bun run clean:branches              # fetch, then delete merged branches
//   bun run clean:branches --dry-run    # only list them
//   bun scripts/clean-branches.js --auto
//     used by the post-checkout hook: at most once per hour, silent when
//     there is nothing to do or when offline

import { statSync } from 'node:fs';

const KEPT_BRANCHES = ['main', 'develop', 'master'];
const BASES = ['origin/develop', 'origin/main'];
const AUTO_INTERVAL_MS = 60 * 60 * 1000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const auto = args.includes('--auto');

function git(...gitArgs) {
  const result = Bun.spawnSync(['git', ...gitArgs], { stderr: 'pipe' });
  return { ok: result.success, out: result.stdout.toString().trim() };
}

const current = git('branch', '--show-current').out;

if (auto) {
  // Detached HEAD: rebase, bisect... do not touch branches meanwhile
  if (!current) process.exit(0);
  const stamp = `${git('rev-parse', '--git-dir').out}/clean-branches.stamp`;
  try {
    if (Date.now() - statSync(stamp).mtimeMs < AUTO_INTERVAL_MS) process.exit(0);
  } catch {
    // No stamp yet: first run
  }
  await Bun.write(stamp, new Date().toISOString());
}

if (!git('fetch', '--prune', '--quiet', 'origin').ok) {
  if (auto) process.exit(0);
  console.error('git fetch failed: cannot tell which remote branches are gone');
  process.exit(1);
}

const bases = BASES.filter(base => git('rev-parse', '--verify', '--quiet', base).ok);
const gone = git('for-each-ref', '--format=%(refname:short)\t%(upstream:track)', 'refs/heads')
  .out.split('\n')
  .map(line => line.split('\t'))
  .filter(([name, track]) => track === '[gone]' && name !== current && !KEPT_BRANCHES.includes(name))
  .map(([name]) => name);

// `git cherry <base> <branch>` prefixes with "+" the commits missing from base
const isMerged = branch => bases.some(base => !git('cherry', base, branch).out
  .split('\n')
  .some(line => line.startsWith('+')));

const merged = gone.filter(isMerged);
const unmerged = gone.filter(branch => !merged.includes(branch));

for (const branch of merged) {
  if (dryRun) {
    console.log(`would delete ${branch} (merged, remote branch gone)`);
  } else if (git('branch', '-D', branch).ok) {
    console.log(`deleted ${branch} (merged, remote branch gone)`);
  }
}

for (const branch of unmerged) {
  console.log(`kept ${branch}: remote branch gone but some commits are not in ${bases.join(' / ')}`);
}

if (!auto && gone.length === 0) {
  console.log('No local branch to clean up');
}
