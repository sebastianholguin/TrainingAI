# TrainingAI — Project Initialization Plan

## Goal
Set up the TrainingAI repository structure, documentation, and reusable tooling (skills) needed before starting implementation of the Employee Management API + UI lab.

## Steps

| # | Step | Status | Notes |
|---|---|---|---|
| 1 | Clone GitHub repo (`sebastianholguin/TrainingAI`) into project folder | Done | Remote repo was empty; `main` branch has no commits yet |
| 2 | Create `docs/specs/` and `docs/plans/` folders | Done | Moved from top-level `specs/`/`plans/` into `docs/` |
| 3 | Create `src/` folder for application code | Done | Empty — scaffolding is step 8 |
| 4 | Write `employee-management-spec.md` | Done | [docs/specs/employee-management-spec.md](../specs/employee-management-spec.md) |
| 5 | Confirm technology stack with user, update spec | Done | C#/.NET, EF Core In-Memory, React + Shadcn UI, xUnit |
| 6 | Create reusable `spec-writer` skill | Done | `~/.claude/skills/spec-writer/` and project `.claude/skills/spec-writer/` |
| 7 | Create reusable `plan-writer` skill | Done | `~/.claude/skills/plan-writer/` and project `.claude/skills/plan-writer/` |
| 8 | Add UI mockups + write `ui-guidelines.md` | Done | [docs/guidelines/employees/](../guidelines/employees/) — 3 mockups documented |
| 9 | Resolve spec/mockup conflicts with user | Done | Keep DOB; split phone into countryCode+phone; title as dropdown; `src/backend`+`src/frontend` |
| 10 | Write project `CLAUDE.md` instructions | Done | [CLAUDE.md](../../CLAUDE.md) |
| 11 | Scaffold .NET backend in `src/backend/` (API + EF Core In-Memory) | Done | `src/backend/` — EmployeeManagement.sln, .NET 10 |
| 12 | Set up xUnit test project in the backend solution | Done | EmployeeApi.Tests with WebApplicationFactory |
| 13 | Implement Employee model, DbContext, DTOs, validation | Done | Employee, EmployeeOptions, DTOs, EmployeeDbContext + seed |
| 14 | Implement Employee CRUD endpoints per spec | Done | EmployeesController + EmployeeOptionsController |
| 15 | Write xUnit tests for endpoints and validation rules | Done | 16 tests passing |
| 16 | Scaffold React + TS + Vite + Tailwind + Shadcn in `src/frontend/` | Done | Vite + React 19 + TS, Tailwind v4, shadcn (indigo theme) |
| 17 | Build app shell (top bar + sidebar) per mockups | Done | `AppShell.tsx` — top bar + sidebar nav |
| 18 | Build Employee Directory list screen | Done | `pages/EmployeeDirectory.tsx` — table, avatars, loading/empty/error states |
| 19 | Build Add/Edit Employee form screen | Done | `pages/EmployeeForm.tsx` — create + edit, zod validation mirroring API |
| 20 | Build Delete Confirmation dialog | Done | `components/DeleteEmployeeDialog.tsx` — shadcn alert-dialog |
| 21 | Wire frontend to API + verify end-to-end | Done | Verified in browser: list, create, edit, delete, 409 mapped to field |
| 23 | Fix bugs found by code review (whitespace-bypassed uniqueness, timezone/leap-day date logic, untranslatable EF query, options drift, unrecoverable options-fetch failure) | Done | 22 backend tests passing; verified via curl + browser |
| 24 | Add `pr-prep` skill and a push/PR-gating test hook | Done | `.claude/hooks/require-tests-before-push.sh`; verified both allow and block paths |
| 22 | Initial commit and push to GitHub (`origin/main`) | Done | 7 commits pushed (`e92f736`..`d43534b`); `main` tracks `origin/main`, fully in sync. Last one (`d43534b`) fixed a real gap in the push-gating hook — its word-boundary matching now catches `git -C <dir> push ...`, which the original fixed-phrase match missed. Verified green before pushing: 22/22 tests, clean build |

## Status Legend
- **Pending** — not started
- **In Progress** — actively being worked on
- **Done** — complete
- **Blocked** — can't proceed (see Notes for why)
- **Skipped** — deliberately not doing this (see Notes for why)
