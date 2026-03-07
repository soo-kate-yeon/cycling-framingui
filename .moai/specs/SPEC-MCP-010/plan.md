# Plan

1. Generate a bundled TypeScript module from `.moai/themes/generated`.
2. Update `@framingui/core` theme loaders to use filesystem first, bundled module second.
3. Add regressions proving bundled fallback works when filesystem resolution returns `null`.
4. Run targeted core and playground-web validation.

