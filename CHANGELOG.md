# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Synchronize the official template workflow to v0.5.1: one canonical skill in `.agents/skills/clone-website/`, an on-demand inspection reference, and a thin Claude Code bridge.
- Remove duplicate legacy prompts and obsolete synchronization scripts; keep existing multi-site routing guidance and bilingual project documentation.
- Pin Next.js and eslint-config-next to 16.3.8 (newer than the upstream 16.3.5 pin) to address GHSA-vcvr-r3jv-pc5j; refresh vulnerable transitive dependencies in the npm lockfile.
- Run all existing application tests and production HTTP route checks in CI.
- Provide an explicit empty catch-all path when generating static clone roots so all four site links resolve in production instead of returning 404.
- Raised the project Node.js baseline to 24 across local development, CI, Docker, and contributor-facing documentation

## [0.3.1] - 2026-03-29

### Fixed
- `sync-agent-rules.sh` failing to resolve `@file` imports on Windows due to CRLF line endings — platform instruction files now correctly inline the Inspection Guide content

## [0.3.0] - 2026-03-29

### Added
- Multi-URL support for `/clone-website` — clone multiple sites in a single command with parallel processing and isolated output
- CI quality gates via GitHub Actions — automated lint, typecheck, and build on every push and PR
- `npm run typecheck` and `npm run check` scripts for local quality validation
- `.gitattributes` for cross-platform line ending normalization
- `.nvmrc` to pin Node.js 20 for contributor consistency

### Changed
- Streamlined PR template — removed redundant checklist items and screenshots section
- Improved project description and README — clearer use cases, limitations, and modern wording
- Refined documentation and agent rules across all platforms for clarity and consistency
- Fixed CRLF handling in `sync-skills.mjs` for reliable Windows operation

### Removed
- Outdated use case from README documentation

## [0.2.0] - 2026-03-28

### Added
- Multi-platform AI agent support: Claude Code, Codex CLI, OpenCode, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Cline/Roo Code, Continue, Amazon Q, Augment Code, Aider
- Platform-specific instruction files and `/clone-website` skill for each supported agent
- `scripts/sync-agent-rules.sh` to regenerate platform instruction files from AGENTS.md
- `scripts/sync-skills.mjs` to regenerate `/clone-website` skill across all platforms
- GEMINI.md for Gemini CLI configuration
- Supported Platforms table in README
- "Updating for Other Platforms" documentation section in README

### Changed
- README now describes the project as multi-agent (Claude Code recommended, not required)
- AGENTS.md updated with sync script reminders

## [0.1.1] - 2026-03-28

### Added
- Bug report and feature request issue templates
- Pull request template with checklist
- CHANGELOG.md following Keep a Changelog format
- Package.json metadata (description, repository, homepage, keywords, engines)

### Fixed
- LICENSE copyright holder now attributed to JCodesMore

## [0.1.0] - 2026-03-28

### Added
- Initial template scaffold for website reverse-engineering with Claude Code
- `/clone-website` skill for full-site cloning pipeline
- `/build-from-spec` and `/customize` skills
- Parallel builder agents with git worktree isolation
- Chrome MCP integration for design token extraction
- Comprehensive inspection guide and project structure documentation
- Next.js 16 + shadcn/ui + Tailwind CSS v4 base scaffold
- MIT license
- README with badges, demo section, quick start, and star history

[Unreleased]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/JCodesMore/ai-website-cloner-template/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/JCodesMore/ai-website-cloner-template/releases/tag/v0.1.0
