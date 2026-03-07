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
3. Run \`validate-environment\` for package presence and Tailwind compatibility.
4. Return the smallest set of fixes needed to restore a working FramingUI setup.

## Expected output

- auth status when relevant
- theme availability when relevant
- missing packages
- install commands
- Tailwind or style-import issues
- prioritized next actions`,
        },
      },
    ],
  };
}
