// Gitmoji unicode emojis list
const gitmojis = [
  '🎨', '⚡️', '🔥', '🐛', '🚑️', '✨', '📝', '🚀', '💄', '🎉',
  '✅', '🔒️', '🔐', '🔖', '🚨', '🚧', '💚', '⬇️', '⬆️', '📌',
  '👷', '📈', '♻️', '➕', '➖', '🔧', '🔨', '🌐', '✏️', '💩',
  '⏪️', '🔀', '📦️', '👽️', '🚚', '📄', '💥', '🍱', '♿️', '💡',
  '🍻', '💬', '🗃️', '🔊', '🔇', '👥', '🚸', '🏗️', '📱', '🤡',
  '🥚', '🙈', '📸', '⚗️', '🔍️', '🏷️', '🌱', '🚩', '🥅', '💫',
  '🗑️', '🛂', '🩹', '🧐', '⚰️', '🧪', '👔', '🩺', '🧱', '🧑‍💻',
  '💸', '🧵', '🦺', '🔮', '🪵', '🪶', '🫥', '🩻', '🫧', '🪤',
];

// Conventional commit types
const conventionalTypes = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
];

// Regex to match gitmoji at start of message
const gitmojiRegex = new RegExp(`^(${gitmojis.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);

// Regex to match conventional commit format: type(scope): description or type: description
const conventionalRegex = new RegExp(`^(${conventionalTypes.join('|')})(\\(.+\\))?:\\s.+`);

export default {
  parserPreset: {
    parserOpts: {
      // Match both gitmoji and conventional formats
      headerPattern: /^(?:(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s)?(?:(\w+)(?:\((.+)\))?:\s)?(.+)$/u,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
    'valid-commit-format': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'valid-commit-format': ({ raw }) => {
          const message = raw.trim();
          const hasGitmoji = gitmojiRegex.test(message);
          const hasConventional = conventionalRegex.test(message);

          return [
            hasGitmoji || hasConventional,
            `Commit must use either:
  - Gitmoji format: <emoji> <description> (e.g., ✨ Add feature)
  - Conventional format: <type>(scope): <description> (e.g., feat: Add feature)`,
          ];
        },
      },
    },
  ],
};
