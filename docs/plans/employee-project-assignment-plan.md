# Employee-Project Assignment (Session 2) — Plan

## Goal
Build on the Session 1 Employee Management lab: add a `Project` model (Name, Description) and a many-to-many relationship between Employees and Projects via a junction table. Support bidirectional assignment (from either the Employee grid or the Project grid), block duplicate assignments with a clear error, seed 50 employees / 10 projects with randomized assignments, and cover the business rules with automated tests. 3-hour lab, building on the existing `src/backend`/`src/frontend` structure.

UI is driven by the mockups in [docs/guidelines/projects/](../guidelines/projects/); see [ui-guidelines.md](../guidelines/projects/ui-guidelines.md) for the extracted design and the conflicts resolved against these acceptance criteria (notably: assignments carry a required `StartDate`; the mockup's status dot, formatted project id, and pagination are explicitly NOT in scope).

## Steps

### Backend

| # | Step | Status | Notes |
|---|---|---|---|
| 1 | Add `Project` entity (Name, Description) | Pending | `src/backend/EmployeeApi/Models/Project.cs` |
| 2 | Add `EmployeeProject` junction entity | Pending | Composite key or unique constraint on `(EmployeeId, ProjectId)` — this is what makes duplicate prevention a DB-level guarantee, not just an application check. Also carries a required `StartDate` (confirmed against the "Assign New Employee" mockup — see [ui-guidelines.md](../guidelines/projects/ui-guidelines.md)) |
| 3 | Update `EmployeeDbContext`: add `DbSet<Project>`, `DbSet<EmployeeProject>`, configure the many-to-many + unique index | Pending | |
| 4 | Add `Project` DTOs + validation (Name required, length caps) | Pending | Mirror `EmployeeDtos.cs` conventions — trim-on-assignment, per [stack-notes.md](../stack-notes.md) |
| 5 | `ProjectsController`: CRUD endpoints | Pending | `GET/POST/PUT/DELETE /projects`, same status-code conventions as `EmployeesController` |
| 6 | Assignment endpoints (bidirectional by design — one pair of endpoints serves both the Employee view and the Project view) | Pending | e.g. `POST /assignments {employeeId, projectId, startDate}`, `DELETE /assignments/{employeeId}/{projectId}`, `GET /employees/{id}/projects`, `GET /projects/{id}/employees` — confirm exact shape when we get here |
| 7 | Enforce duplicate-assignment rejection | Pending | `409 Conflict` with a clear message, matching the existing email/national-ID duplicate pattern in `EmployeesController` |
| 8 | Seed data: 50 employees, 10 projects, randomized non-duplicate assignments | Pending | Extend `EmployeeDbSeeder`; generate rather than hand-write 50 records |
| 9 | xUnit tests: Project CRUD, assignment create/remove, duplicate rejected (409), seed produces no duplicates | Pending | Extends the existing 22-test suite in `EmployeeApi.Tests` |

### Frontend

| # | Step | Status | Notes |
|---|---|---|---|
| 10 | Add `Project` types + API client methods | Pending | `src/frontend/src/lib/types.ts`, `api.ts` |
| 11 | Project Management list screen | Pending | Per `Project Management.png` — name + internal id, team avatars/count, edit/delete actions. No status dot, no formatted id, no pagination/sorting (see Resolved conflicts in ui-guidelines.md) |
| 12 | Create/Edit Project form, with embedded "Assigned Employees" table | Pending | Per `New Project.png` — Name + Description fields, plus an inline assigned-employees table with its own "+ Add Employee" action that opens the assignment dialog (step 14) |
| 13 | Delete Project confirmation dialog | Pending | Reuse the `DeleteEmployeeDialog` pattern |
| 14 | Assignment dialog — Project-side ("Assign New Employee") | Pending | Per `Assign New Employee.png` — employee picker + required Start Date field, reached from step 12's form |
| 15 | Assignment dialog — Employee-side ("Assign to Project") | Pending | No mockup exists; mirror step 14's dialog exactly, swapping the picker to projects not yet assigned to this employee |
| 16 | Surface duplicate-assignment errors clearly in the UI | Pending | Inline on the picker field (not just a toast), matching the existing 409 → field handling in `EmployeeForm.tsx` |
| 17 | Add "Projects" to `AppShell` navigation | Pending | Briefcase icon per the mockups |

### Cross-cutting

| # | Step | Status | Notes |
|---|---|---|---|
| 18 | Extract UI guidelines from `docs/guidelines/projects/` mockups | Done | [ui-guidelines.md](../guidelines/projects/ui-guidelines.md) — 3 mockups documented, 4 conflicts resolved with user (StartDate kept, status dot/formatted id/pagination excluded, Employee-side dialog mirrors Project-side) |
| 19 | Confirm whether a formal spec doc is wanted for this feature | Pending | The acceptance criteria plus ui-guidelines.md cover requirements well; ask before assuming a separate `docs/specs/` doc is needed on top of this plan |
| 20 | Full test suite + frontend build passing | Pending | Also what the push/PR hook will check before anything ships |
| 21 | Security review pass | Pending | Acceptance criteria explicitly calls for this — run before considering the feature done |
| 22 | Update this plan's statuses as work proceeds; commit | Pending | Ongoing — update in the same turn each step completes |

## Status Legend
- **Pending** — not started
- **In Progress** — actively being worked on
- **Done** — complete
- **Blocked** — can't proceed (see Notes for why)
- **Skipped** — deliberately not doing this (see Notes for why)
