# Acceptance

- `listThemes()` returns canonical themes when filesystem theme directories are unavailable.
- `loadTheme('pebble')` succeeds without `.moai` access.
- `themeExists('pebble')` is `true` without `.moai` access.
- Existing filesystem theme directories still override bundled fallback.
