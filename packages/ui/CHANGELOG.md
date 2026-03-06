# Changelog

All notable changes to @framingui/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.3] - 2026-03-06

### Changed

- Template exports now compose metadata from the `@framingui/core` catalog instead of duplicating template definitions in `@framingui/ui`.
- Added a direct runtime dependency on `@framingui/core` so published template exports resolve catalog data consistently.
- Template entrypoints now live under `@framingui/ui/templates` so general UI consumers do not pull template-only runtime code into client bundles.

### Removed

- Removed duplicate legacy `.jsx` template sources, duplicate `.stories.jsx` files, and duplicate registry tests.
