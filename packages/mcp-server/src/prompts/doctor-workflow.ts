export function getDoctorWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# FramingUI Doctor Workflow

Use this workflow when the user asks why FramingUI generation or styling is not working in their project.

## Primary commands

- \`/doctor [<project-path>] [--auth] [--tailwind] [--themes] [--fix-hints]\`
- \`/install-check [<project-path>] [--for <screen|section|file>] [--packages-only]\`

## Workflow

1. Inspect session status with \`whoami\` when auth or entitlement issues are suspected.
2. Confirm theme access with \`list-themes\`.
3. Run \`validate-environment\` for package presence, Tailwind compatibility, and style contract detection.
4. Inspect the style contract result and decide whether the project should stay utility-first or migrate to FramingUI-native variables.
5. Return the smallest set of fixes needed to restore a working FramingUI setup.

## Expected output

- auth status when relevant
- theme availability when relevant
- missing packages
- install commands
- Tailwind or style-import issues
- style contract classification and migration recommendation when relevant
- prioritized next actions`,
        },
      },
    ],
  };
}
