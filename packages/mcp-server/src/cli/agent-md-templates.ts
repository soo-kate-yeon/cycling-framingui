export type Framework = 'nextjs' | 'vite';

export function generateClaudeMdSection(framework: Framework): string {
  const importPath = framework === 'nextjs' ? 'app/page.tsx' : 'src/App.tsx';

  return `
## FramingUI Workflow

### Authentication

Before using licensed themes:

\`\`\`bash
framingui-mcp login
\`\`\`

### Production Screen Flow

1. Decide the style contract:
   - \`host-utility\`
   - \`framingui-native\`
   - \`migrate\`
2. Inspect the theme when defaults matter:
   - \`preview-theme\`
3. Gather generation context:
   - \`get-screen-generation-context\`
4. Resolve ambiguity before drafting:
   - \`preview-component\`
   - \`list-icon-libraries\` when icons are needed
5. Validate structure:
   - \`validate-screen-definition\`
6. Write React code from the validated definition
7. Verify project integration:
   - \`validate-environment\` with \`sourceFiles\`

### Style Contract Rules

- If the project stays \`host-utility\`, keep utility classes explicit.
- If the project uses \`framingui-native\`, ensure the global stylesheet imports \`@framingui/ui/styles\` and the app root mounts \`FramingUIProvider\` with the generated \`framingui-theme\`.

### Slash Commands

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

### Component Rule

Do not claim a FramingUI component is unavailable without checking \`list-components\` or \`preview-component\`.

### Example

\`\`\`tsx
// ${importPath}
import { FramingUIProvider, Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';
import framinguiTheme from './framingui-theme';

export default function Page() {
  return (
    <FramingUIProvider theme={framinguiTheme}>
      <Card>
        <CardHeader>
          <CardTitle>Ready for MCP-assisted UI work</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Continue</Button>
        </CardContent>
      </Card>
    </FramingUIProvider>
  );
}
\`\`\`
`;
}

export function generateAgentsMdSection(framework: Framework): string {
  const importPath = framework === 'nextjs' ? 'app/page.tsx' : 'src/App.tsx';

  return `
## FramingUI Workflow

FramingUI is available in this project through MCP.

### Required Sequence

1. Confirm authentication if licensed themes are needed.
2. Decide the style contract before generation.
3. Use \`preview-theme\` when theme defaults or recipes matter.
4. Use \`get-screen-generation-context\` as the main entry point.
5. Use \`preview-component\` for any ambiguous component contract.
6. Use \`list-icon-libraries\` before adding icons.
7. Validate structure with \`validate-screen-definition\`.
8. Write React code directly from the validated definition.
9. Run \`validate-environment\` with \`sourceFiles\` before final handoff.

### Style Contract

- \`host-utility\`: keep explicit utility styling
- \`framingui-native\`: import \`@framingui/ui/styles\`, mount \`FramingUIProvider\`, then rely on FramingUI variants
- \`migrate\`: stop and clarify the migration path

### Allowed HTML

Semantic wrappers such as \`header\`, \`nav\`, \`section\`, and \`footer\` may remain HTML.
Interactive and form primitives should use FramingUI components when they exist.

### Example

\`\`\`tsx
// ${importPath}
import { FramingUIProvider, Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';
import framinguiTheme from './framingui-theme';

export default function Page() {
  return (
    <FramingUIProvider theme={framinguiTheme}>
      <Card>
        <CardHeader>
          <CardTitle>FramingUI project setup</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Continue</Button>
        </CardContent>
      </Card>
    </FramingUIProvider>
  );
}
\`\`\`
`;
}
