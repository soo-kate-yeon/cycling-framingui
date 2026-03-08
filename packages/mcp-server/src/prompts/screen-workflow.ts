/**
 * MCP Prompts: Screen Generation Workflow
 * Step-by-step guide for the production screen generation process
 */

/**
 * Screen Workflow prompt with guarded direct-write process
 */
export function getScreenWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# Framingui Screen Generation Workflow

This is the **recommended production workflow** for generating screens with Framingui.

Prerequisite: authenticate with \`framingui-mcp login\` or provide \`FRAMINGUI_API_KEY\`.
Optional: call \`whoami\` if you want to inspect the current session and licensed themes before starting.

## Overview

The workflow ensures:
- ✅ Correct component-first usage with inline props/variants
- ✅ Validated screen structure with auto-fix patches
- ✅ Theme recipes and component contracts are visible before code is written
- ✅ All dependencies installed
- ✅ Tailwind CSS properly configured
- ✅ Style contract compatibility checked before relying on FramingUI component defaults

## Step 0: Detect Style Contract

Before generating or integrating a screen, determine which styling contract the target project already uses.

- \`framingui-native\`: project imports FramingUI styles or defines the full FramingUI variable contract
- \`host-utility\`: project styles screens with direct Tailwind utilities and does not expose FramingUI variables
- \`mixed\`: project defines only some FramingUI variables, which is the highest-risk state for broken component styling

**Rule:** do not silently mix a utility-first host page with FramingUI component default variants in the same screen. Either:
- stay utility-first and use explicit classes, or
- migrate the page to the FramingUI variable contract after confirming with the user

**Mandatory decision:** choose one path before writing code:
- \`host-utility\`: preserve the host utility stack and keep FramingUI usage explicit with reviewed utility classes
- \`framingui-native\`: import \`@framingui/ui/styles\` from the global stylesheet and rely on FramingUI variables/variants
- \`migrate\`: stop and ask for a migration decision before continuing

**Enforcement:** if \`projectPath\` is known, Step 0 preflight is required before \`/screen\` or \`/section\` generation.
Use:
\`\`\`json
{
  "projectPath": "/path/to/project",
  "requiredPackages": [],
  "checkTailwind": true,
  "checkStyles": true
}
\`\`\`
Block generation when:
- \`styles.styleContract === "mixed"\`
- \`styles.styleContract === "host-utility"\` and the user did not explicitly choose \`--style-contract host-utility\`

If \`styles.styleContract === "framingui-native"\` or the user explicitly chooses \`--style-contract framingui-native\`, verify that the app imports:
\`\`\`css
@import '@framingui/ui/styles';
\`\`\`
from a global stylesheet such as \`app/globals.css\` or \`styles/globals.css\`.

## Step 1/4: Get Screen Generation Context

**Tool:** \`get-screen-generation-context\`

**Purpose:** Gather all context needed to create a Screen Definition

**Input:**
\`\`\`json
{
  "description": "User dashboard with profile card and recent activity",
  "themeId": "minimal-workspace",
  "includeExamples": true
}
\`\`\`

**Output:**
- Template hints for inspiration
- A component plan and section plan for guided drafting
- Available components with **inline props and variants**
- A definition starter object for the first draft
- Screen Definition JSON schema
- Example definitions
- Theme recipes
- Warnings when component metadata could not be loaded cleanly

**When to use:**
- Beginning of every screen generation
- When you need component suggestions
- When you want template inspiration without hard-coding the screen to a template

**Guardrail:** if the response includes \`warnings\`, do not guess missing props. Resolve the warning first with \`preview-component\` or by retrying the context fetch.
**Guardrail:** treat \`templateHints\` as inspiration only. \`componentPlan\`, \`components\`, and the validated definition are the contract.

### Step 1A: Resolve Discovery Gaps Before Drafting

Do not proceed from Step 1 directly into drafting if any of these are still ambiguous:

- **Component ambiguity:** call \`preview-component\` for every component whose props, variants, or availability are uncertain
- **Theme ambiguity:** call \`preview-theme\` whenever a theme is selected and visual recipes or variable-backed defaults matter
- **Icon ambiguity:** call \`list-icon-libraries\` before introducing icons or icon-only actions

**Hard rule:** do not claim that FramingUI lacks a component unless you inspected the catalog with \`list-components\` or \`preview-component\`.
For example, form controls such as \`Input\` must not fall back to raw \`<input>\` without an explicit reason.

---

## Step 2/4: Validate Screen Definition

**Tool:** \`validate-screen-definition\`

**Purpose:** Ensure your Screen Definition JSON is correct before generating code

**Input:**
\`\`\`json
{
  "definition": {
    "id": "user-dashboard",
    "shell": "shell.web.dashboard",
    "page": "page.dashboard",
    "sections": [
      {
        "id": "header",
        "pattern": "section.container",
        "components": [...]
      }
    ]
  },
  "strict": true
}
\`\`\`

**Output:**
- \`valid\`: true/false
- \`errors\`: Array of validation errors with suggestions and **autoFix patches**
- \`warnings\`: Potential issues
- \`suggestions\`: Improvement recommendations with **autoFix patches**
- \`autoFixPatches\`: Aggregated JSON Patch operations to fix all issues

**When to use:**
- Always before generating code (Step 3)
- When fixing validation errors (apply autoFixPatches)
- When exploring screen structure improvements

---

## Step 3/4: Write React Code Directly

**Purpose:** Write production-ready React code using the validated Screen Definition and the component contracts from Step 1.

**Required constraints:**
- Preserve the validated \`shell\`, \`page\`, \`section\`, and slot structure from Step 2
- Use only components returned in Step 1 unless you explicitly inspect more with \`preview-component\`
- Use documented props and variants; do not invent props
- Prefer \`@framingui/ui\` components over raw HTML when an equivalent FramingUI primitive exists
- Prefer tokens, theme recipes, and existing FramingUI primitives over raw design values
- Semantic wrappers such as \`header\`, \`nav\`, \`section\`, and \`footer\` may stay as HTML, but interactive and form primitives must use FramingUI components when available
- If a screen needs custom JSX beyond the contract, keep it local and explain why FramingUI primitives were insufficient

**Style-contract constraints:**
- If the chosen contract is \`framingui-native\`, ensure the project imports \`@framingui/ui/styles\` before relying on component default variants
- If the chosen contract is \`host-utility\`, prefer reviewed token-aligned utility classes and theme recipes; avoid ad-hoc raw styling when a FramingUI component prop or recipe already covers the need

**Optional helper:** \`generate_screen\` may still be used as a codegen assistant or reference output, but it is not the default production workflow.

---

## Step 4/4: Validate Environment (Optional but Recommended)

**Tool:** \`validate-environment\`

**Purpose:** Verify project has required packages and Tailwind is configured correctly

**Input:**
\`\`\`json
{
  "projectPath": "/path/to/package.json",
  "requiredPackages": ["@radix-ui/react-slot", "@radix-ui/react-avatar"],
  "sourceFiles": ["app/page.tsx"],
  "checkTailwind": true,
  "checkStyles": true
}
\`\`\`

**Output:**
- \`installed\`: Packages already in package.json
- \`missing\`: Packages that need installation
- \`installCommands\`: Commands for npm/yarn/pnpm/bun
- \`tailwind\`: Tailwind config validation results
  - \`issues\`: Problems found
  - \`fixes\`: How to fix each issue
- \`styles\`: Style contract validation results
  - \`styleContract\`: framingui-native, host-utility, mixed, or unknown
  - \`issues\`: CSS contract mismatch risks
  - \`fixes\`: Recommended next actions before integration
- \`codegen\`: Optional scan of generated React source files for raw HTML primitives that should use \`@framingui/ui\`

**Tailwind Validation Checks:**
- ✅ tailwind.config.{ts,js,mjs,cjs} exists
- ✅ @framingui/ui content paths included
- ✅ tailwindcss-animate plugin configured

**When to use:**
- After writing code (Step 3), when user's package.json path is known
- Before delivering code to user
- When user reports missing styles or animations

---

## Complete Example

\`\`\`
User: "Create a login page with email/password fields"

0. Call validate-environment({ projectPath: "...", requiredPackages: [], checkStyles: true })
   -> Classify style contract and decide host-utility vs framingui-native before generation
   -> If framingui-native, confirm global CSS imports @framingui/ui/styles

1. Call get-screen-generation-context({ description: "login page..." })
   → Receive template hints, component plan, section plan, definition starter, and component contracts
   → If any form control, icon, or theme usage is ambiguous, call preview-component / list-icon-libraries / preview-theme before drafting

2. Generate Screen Definition JSON based on definitionStarter + componentPlan
   → Call validate-screen-definition({ definition: {...} })
   → Apply autoFixPatches if any, re-validate if needed

3. Write React code directly from the validated definition and Step 1 component contracts
   → Preserve the validated layout structure
   → Use documented props instead of guessing

4. Call validate-environment({ projectPath: "...", requiredPackages: [...], sourceFiles: ["app/page.tsx"] })
   → Show user missing packages and install commands
   → Warn about Tailwind config issues if any
   → Fail the handoff if codegen scan finds raw HTML primitives that should use FramingUI components

5. Deliver code to user with complete setup instructions
\`\`\`

## Troubleshooting

**Validation fails in Step 2:**
- Read error messages carefully - they include suggestions and autoFix patches
- Apply autoFixPatches to auto-correct common issues
- Check token names match SPEC-LAYOUT-001
- Verify component IDs exist (use list-components)
- Prefer componentPlan before exploring optional alternatives

**Code writing is blocked in Step 3:**
- Ensure Screen Definition passed validation in Step 2
- Resolve any Step 1 metadata warnings before guessing props
- Use \`preview-component\` when a component contract is incomplete
- Use \`preview-theme\` before relying on theme defaults you have not inspected
- Use \`list-icon-libraries\` before adding icons that were not explicitly chosen

**Missing dependencies:**
- Always run Step 4 to verify environment
- Show install commands to user
- Check Tailwind config includes @framingui/ui paths

**Components render without styles:**
- Verify Tailwind content paths include @framingui/ui
- Check tailwindcss-animate plugin is configured
- Check whether the target project is \`host-utility\`, \`mixed\`, or \`framingui-native\`
- If the project is \`framingui-native\`, verify the global stylesheet imports \`@framingui/ui/styles\`
- If the project is utility-first, prefer explicit reviewed classes instead of relying on FramingUI component defaults
- Run validate-environment to diagnose

---

## Best Practices

1. ✅ Always run Step 0 preflight before generation when projectPath is known
2. ✅ Validate before writing code (Step 2)
3. ✅ Write code from the validated definition and component contracts (Step 3)
4. ✅ Use \`generate_screen\` only as an optional helper, not as a required workflow step
5. ✅ Check environment before delivering code (Step 4)
6. ✅ Use strict validation mode for production
7. ✅ Include theme recipes for visual consistency
8. ✅ Use inline props from context instead of guessing
9. ✅ Use template hints only as inspiration, not as structural constraints
10. ✅ Confirm the target style contract before relying on CSS variables or component defaults
11. ✅ Call \`preview-component\`, \`preview-theme\`, or \`list-icon-libraries\` whenever Step 1 leaves an ambiguity
12. ✅ Run post-generation \`validate-environment\` with \`sourceFiles\` to catch raw HTML primitives and style-contract drift

## Alternative Workflows

**Legacy prototyping helper:**
- \`generate-blueprint\` → \`export-screen\` remains available for backward compatibility, but new agent flows should prefer \`get-screen-generation-context\`

**Production (recommended):**
- Follow complete 4-step workflow above

**Optional codegen assist:**
- \`generate_screen\` can be used after validation when you want a reference implementation or a starting point`,
        },
      },
    ],
  };
}
