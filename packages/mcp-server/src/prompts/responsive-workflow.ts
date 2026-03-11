export function getResponsiveWorkflowPrompt() {
  return {
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `# FramingUI Responsive Optimization Workflow

Use this workflow when the user asks to adapt an existing screen for smaller viewports, touch ergonomics, or density changes.

## Primary command

\`/responsive <target> [--mode mobile-first|tablet-safe|touch-optimized] [--density preserve|denser|lighter] [--breakpoint sm|md|lg]\`

## Workflow

1. Inspect the target screen or screen definition.
2. Call \`list_tokens\` to confirm breakpoint and layout token options when layout changes are needed.
3. Preserve the existing information architecture unless the current layout is clearly broken on smaller screens.
4. Apply one primary responsive strategy:
   - \`mobile-first\`: prioritize stacked layouts, simplified nav, compressed controls
   - \`tablet-safe\`: preserve layout intent while preventing breakage around medium widths
   - \`touch-optimized\`: increase hit targets, action spacing, and gesture-safe layouts
5. Apply density refinement inside this command, not as a separate command:
   - \`preserve\`: keep current information density, mainly reflow layout
   - \`denser\`: preserve more information in constrained layouts
   - \`lighter\`: reduce clutter and collapse secondary content
6. Validate the updated definition with \`validate-screen-definition\`.
7. If code output is requested, re-run \`generate_screen\`.

## Expected output

- Breakpoint-specific recommendations
- Layout changes by section
- Mobile/tablet nav strategy
- Table/card/list transformations where relevant
- Any overflow or cramped-interaction risks
- Updated definition or regenerated code when requested

## Important constraints

- Do not invent unsupported layout tokens.
- Do not split density into a standalone workflow; keep it under responsive optimization.
- Prefer safe reflow over aesthetic-only changes.
- If the current screen is already responsive, report that explicitly instead of forcing unnecessary edits.`,
        },
      },
    ],
  };
}
