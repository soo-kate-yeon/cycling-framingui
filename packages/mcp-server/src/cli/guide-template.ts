export type Framework = 'nextjs' | 'vite';

export function generateGuide(framework: Framework): string {
  const appFile = framework === 'nextjs' ? 'app/page.tsx' : 'src/App.tsx';

  return `# FramingUI Guide

FramingUI is installed in this project as an MCP-assisted design system for production UI work.

## Authentication

Authenticate before using account-scoped themes and quota visibility:

\`\`\`bash
framingui-mcp login
\`\`\`

Check the current state with:

\`\`\`bash
framingui-mcp status
\`\`\`

Use \`whoami\` when you need the current entitlement list or shadow quota snapshot.

## Recommended Workflow

1. If the project path is known, call \`detect-project-context\` first to store the default platform/runtime for this session.
2. Decide the style contract for this project:
   - \`host-utility\`
   - \`framingui-native\`
   - \`migrate\`
3. Inspect theme and component contracts before drafting:
   - \`preview-theme\`
   - \`preview-component\`
   - \`list-icon-libraries\` when icons are needed
4. Call \`get-screen-generation-context\`
5. For web projects, validate the generated definition with \`validate-screen-definition\`
6. Write React or React Native code from the returned contract
7. Run \`validate-environment\` with \`sourceFiles\` before handoff

If the detected project is Expo or React Native, keep using the direct-write path and do not repeat \`platform: "react-native"\` on every tool call unless you need an explicit override. Prefer \`@framingui/react-native\` where the runtime surface exists, then fall back to host primitives.

### React Native / Expo

- Call \`get-screen-generation-context\` with \`platform: "react-native"\`
- Prefer \`@framingui/react-native\` exports for common screen structure and controls
- Keep custom screen styles inside \`StyleSheet.create\`
- Run \`validate-environment\` with \`platform: "react-native"\` and \`sourceFiles\` before handoff

## Style Contract Rules

### host-utility

Keep utility classes explicit. Do not rely on FramingUI default variants unless you intentionally migrate.

### framingui-native

Your global stylesheet should import:

\`\`\`css
@import '@framingui/ui/styles';
\`\`\`

Your root app entry should also mount \`FramingUIProvider\` with the generated \`framingui-theme\` module.

## Slash Commands

FramingUI guidance is available for:

- \`/screen\`
- \`/draft\`
- \`/section\`
- \`/responsive\`
- \`/a11y\`
- \`/theme-swap\`
- \`/doctor\`
- \`/install-check\`
- \`/export\`
- \`/update\`

## Example Component Usage

\`\`\`tsx
// ${appFile}
import { FramingUIProvider, Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';
import framinguiTheme from './framingui-theme';

export default function Page() {
  return (
    <FramingUIProvider theme={framinguiTheme}>
      <Card>
        <CardHeader>
          <CardTitle>FramingUI is ready</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Continue</Button>
        </CardContent>
      </Card>
    </FramingUIProvider>
  );
}
\`\`\`

## Guardrails

- Do not claim that a component is unavailable without checking the catalog.
- Treat templates as hints, not the final structure.
- Treat the validated screen definition as the production contract.
- Keep semantic wrappers as HTML only when there is no FramingUI primitive to replace them.
- For Expo / React Native targets, use \`detect-project-context\` once, prefer \`@framingui/react-native\` where possible, and avoid \`@framingui/ui\` imports.
`;
}
