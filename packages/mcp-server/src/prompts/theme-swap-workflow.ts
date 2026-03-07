export function getThemeSwapWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# FramingUI Theme Swap Workflow

Use this workflow when the user wants to keep screen structure but change the visual system.

## Primary command

\`/theme-swap <target> --to <themeId> [--from <themeId>] [--output code|diff]\`

## Workflow

1. Confirm the target theme is available with \`list-themes\`.
2. Inspect the theme with \`preview-theme\` if recipe coverage or tone differences matter.
3. Re-run supported generation paths so the new theme is applied through recipes and contract-backed code generation.
4. Warn when a component-theme pairing lacks a supported recipe path.
5. If the user is applying the result inside a project, validate the environment when dependencies or setup requirements change.

## Expected output

- regenerated output or diff summary
- target theme id
- recipe coverage notes
- unsupported pairing warnings when relevant`,
        },
      },
    ],
  };
}
