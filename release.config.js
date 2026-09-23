// Semantic-release configuration
// Supports gitmoji (`✨ Add feature`), conventional (`feat(scope): add feature`)
// and hybrid (`✨ feat(scope): add feature`) commit formats.

// Gitmoji → version bump and release notes section.
// Emojis are listed without the U+FE0F variation selector (stripped by the parser).
// `code` is the shortcode form, used by Dependabot (e.g. `:arrow_up: Bump ...`).
const GITMOJIS = [
  { type: '💥', code: ':boom:', release: 'major', section: '💥 Breaking Changes' },
  { type: '✨', code: ':sparkles:', release: 'minor', section: '✨ Features' },
  { type: '🎉', code: ':tada:', release: 'minor', section: '✨ Features' },
  { type: '🐛', code: ':bug:', release: 'patch', section: '🐛 Bug Fixes' },
  { type: '🚑', code: ':ambulance:', release: 'patch', section: '🐛 Bug Fixes' },
  { type: '🩹', code: ':adhesive_bandage:', release: 'patch', section: '🐛 Bug Fixes' },
  { type: '🔒', code: ':lock:', release: 'patch', section: '🔒 Security' },
  { type: '⚡', code: ':zap:', release: 'patch', section: '⚡ Performance' },
  { type: '♻', code: ':recycle:', release: 'patch', section: '♻️ Refactoring' },
  { type: '🚀', code: ':rocket:', release: 'patch', section: '🚀 Deployment' },
  { type: '⬆', code: ':arrow_up:', release: 'patch', section: '⬆️ Dependencies' },
  { type: '⬇', code: ':arrow_down:', release: 'patch', section: '⬆️ Dependencies' },
];

// Conventional commit types → version bump and release notes section.
const CONVENTIONAL_TYPES = [
  { type: 'feat', release: 'minor', section: '✨ Features' },
  { type: 'fix', release: 'patch', section: '🐛 Bug Fixes' },
  { type: 'perf', release: 'patch', section: '⚡ Performance' },
  { type: 'refactor', release: 'patch', section: '♻️ Refactoring' },
];

const TYPES = [
  ...GITMOJIS.flatMap(({ code, ...gitmoji }) => [gitmoji, { ...gitmoji, type: code }]),
  ...CONVENTIONAL_TYPES,
];

// Header: `<emoji|:shortcode:> [type(scope): ]subject` or `type(scope)[!]: subject`.
// The leading emoji (or the conventional type when there is no emoji) becomes `type`.
// Needs a real RegExp with the `u` flag, which is why this config is JS and not JSON.
const parserOpts = {
  headerPattern:
    /^(\p{Extended_Pictographic}(?=\uFE0F?\s)|:\w+:(?=\s)|\w+(?=[(!:]))\uFE0F?(?:\(([^)]+)\))?!?:?\s*(?:\w+(?:\([^)]+\))?!?:\s)?(.+)$/u,
  headerCorrespondence: ['type', 'scope', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
};

export default {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        parserOpts,
        releaseRules: [
          { breaking: true, release: 'major' },
          ...TYPES.map(({ type, release }) => ({ type, release })),
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        parserOpts,
        presetConfig: {
          types: TYPES.map(({ type, section }) => ({ type, section })),
        },
      },
    ],
    // Sets the version in package.json (committed by @semantic-release/git);
    // nothing is published to npm
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        // Kept at the top of the file, release notes are inserted below
        changelogTitle: '# Changelog\n\nAll notable changes to this project will be documented in this file.',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: '🔖 Release v${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'CHANGELOG.md',
            label: 'Changelog',
          },
        ],
        successComment: false,
        releasedLabels: false,
      },
    ],
  ],
};
