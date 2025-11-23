# Changelog
All notable changes to this project will be documented in this file.

The format follows the **Keep a Changelog** standard.  
This project adheres to **Semantic Versioning (SemVer)**.

---

## [Unreleased]

### Added
- Full authentication workflow using Supabase.
- Login page with improved visual design.
- SignUp page with full account creation flow.
- `ProtectedRoute` component to secure authenticated routes.
- Global navbar with user menu and logout.
- Checklist saving directly into Supabase history.
- History page loading items filtered by logged user ID.
- Rendered history list with better structure and formatting.
- GuidePopover using Floating UI for accurate positioning.
- Clipboard copy button for generated reports.
- Support for custom comments inside checklist items.

### Changed
- Refactored session loading to avoid duplicate `GoTrueClient` instances.
- Updated checklist save payload to include `usuario_id`.
- Improved Login UI (gradient background, focus states, glass effect).
- Reorganized routing using `AppRoutes`.

### Fixed
- Fixed session not being read correctly by Supabase.
- Fixed history showing items from other users.
- Fixed popover appearing without styling or outside viewport.
- Fixed import error for `ProtectedRoute`.
- Fixed missing `data` field when saving history (added timestamp).
- Fixed Supabase client being initialized twice.

---

## [0.1.0] – 2025-XX-XX
### Added
- First working version of the project.

