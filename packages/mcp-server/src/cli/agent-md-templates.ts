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

1. If the project path is known, call \`detect-project-context\` to establish the session default platform/runtime.
2. Decide the style contract:
   - \`host-utility\`
   - \`framingui-native\`
   - \`migrate\`
3. Inspect the theme when defaults matter:
   - \`preview-theme\`
4. Gather generation context:
   - \`get-screen-generation-context\`
5. Resolve ambiguity before drafting:
   - \`preview-component\`
   - \`list-icon-libraries\` when icons are needed
6. Validate structure for web screen-definition work:
   - \`validate-screen-definition\`
7. Write React or React Native code from the returned contract
8. Verify project integration:
   - \`validate-environment\` with \`sourceFiles\`

### React Native Direct-Write Flow

For Expo or React Native targets:

1. Call \`detect-project-context\` with the project path when available
2. Call \`get-screen-generation-context\` without repeating \`platform\` unless you need an explicit override
3. Review only React Native compatible components and guidance
4. Write the screen directly with \`@framingui/react-native\` exports where available, then \`react-native\` primitives or local app abstractions
5. Run \`validate-environment\` with:
   - \`platform: "react-native"\`
   - \`projectPath\`
   - \`requiredPackages\`
   - \`sourceFiles\`
6. Fix any hardcoded style drift or web-only patterns before handoff

### Style Contract Rules

- If the project stays \`host-utility\`, keep utility classes explicit.
- If the project uses \`framingui-native\`, ensure the global stylesheet imports \`@framingui/ui/styles\` before relying on FramingUI default variants.

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
Do not recommend \`@framingui/ui\` imports for React Native targets.
Prefer \`@framingui/react-native\` when the runtime surface exists for the requested primitive.

### Example

\`\`\`tsx
// ${importPath}
import '@framingui/ui/styles';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ready for MCP-assisted UI work</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Continue</Button>
      </CardContent>
    </Card>
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
2. If the project path is known, call \`detect-project-context\` first.
3. Decide the style contract before generation.
4. Use \`preview-theme\` when theme defaults or recipes matter.
5. Use \`get-screen-generation-context\` as the main entry point.
6. Use \`preview-component\` for any ambiguous component contract.
7. Use \`list-icon-libraries\` before adding icons.
8. Validate structure with \`validate-screen-definition\` for web screen-definition work.
9. Write code directly from the returned contract.
10. Run \`validate-environment\` with \`sourceFiles\` before final handoff.

### React Native Projects

If the target project is Expo or React Native:

- call \`detect-project-context\` when the project path is available
- rely on the stored session default instead of repeating \`platform: "react-native"\` on every discovery call
- write the screen directly using \`@framingui/react-native\` where available, then host app primitives or local abstractions
- do **not** import \`@framingui/ui\`
- run \`validate-environment\` with \`platform: "react-native"\` and \`sourceFiles\`
- fix hardcoded colors, spacing, radius values, and web-only patterns such as \`className\`

### Style Contract

- \`host-utility\`: keep explicit utility styling
- \`framingui-native\`: import \`@framingui/ui/styles\` and then rely on FramingUI variants
- \`migrate\`: stop and clarify the migration path

### Allowed HTML

Semantic wrappers such as \`header\`, \`nav\`, \`section\`, and \`footer\` may remain HTML.
Interactive and form primitives should use FramingUI components when they exist.
For React Native targets, use \`@framingui/react-native\` where available, then host app/native primitives instead of HTML or \`@framingui/ui\`.

### Example

\`\`\`tsx
// ${importPath}
import '@framingui/ui/styles';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FramingUI project setup</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Continue</Button>
      </CardContent>
    </Card>
  );
}
\`\`\`
`;
}
