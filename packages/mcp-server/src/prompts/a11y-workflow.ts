export function getA11yWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `# FramingUI Accessibility Workflow

Use this workflow when the user asks for accessibility review or fixes.

## Primary command

\`/a11y <target> [--fix] [--scope full|form|dialog|nav]\`

## What to inspect

- heading hierarchy
- landmark structure
- form labels and descriptions
- dialog semantics
- focus order and keyboard traps
- tap target size
- contrast risks based on current theme and token usage

## Workflow

1. Inspect the target definition or rendered structure.
2. Use \`validate-screen-definition\` as the contract baseline.
3. Use \`preview-component\` when component semantics or variants are relevant.
4. Report issues grouped by severity.
5. If \`--fix\` or an equivalent request is present, return a patch or regenerated output only when the fix is safe and contract-preserving.

## Expected output

- findings
- severity
- likely impact
- recommended fix
- optional patch or regenerated output`,
        },
      },
    ],
  };
}
