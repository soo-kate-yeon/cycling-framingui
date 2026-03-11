export function getUpdateWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `# FramingUI Update Workflow

Use this workflow when the user wants to refresh installed FramingUI packages in a project.

## Primary command

\`/update [<project-path>] [--check]\`

## Workflow

1. Inspect the target project's package.json.
2. Detect which FramingUI packages are already installed.
3. Detect the package manager from lockfiles.
4. Build the correct update command for the detected package manager.
5. If the user requested a dry run, show the command only.
6. If no FramingUI packages are installed, stop and suggest \`framingui-mcp init\`.

## Expected output

- detected package manager
- installed FramingUI packages
- exact update command
- remediation hint when nothing is installed`,
        },
      },
    ],
  };
}
