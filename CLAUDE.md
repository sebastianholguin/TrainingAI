# TrainingAI — Employee Management Lab

## What this is
A 2-hour lab building a RESTful API with an in-memory database plus a frontend UI to manage `Employee` records. See [docs/specs/employee-management-spec.md](docs/specs/employee-management-spec.md) for full requirements.

## Technology stack

| Layer | Technology |
|---|---|
| Backend | C# / .NET 10, ASP.NET Core Web API |
| Data store | EF Core — **In-Memory provider only** (no persistent DB) |
| Frontend | React + TypeScript + Vite + Tailwind + Shadcn UI |
| Testing | xUnit |

Do not introduce other frameworks, ORMs, or a persistent database. The in-memory store is a deliberate constraint of the lab, not a placeholder to "upgrade" later.

## Repository layout

```
TrainingAI/
├── CLAUDE.md                  # this file
├── docs/
│   ├── specs/                 # what to build (requirements)
│   ├── plans/                 # ordered steps + status tracking
│   └── guidelines/            # UI mockups + design guidance
│       └── employees/         # PNG mockups for the Employee screens
├── src/
│   ├── backend/               # .NET solution: API + xUnit tests
│   └── frontend/              # React + Shadcn UI app
└── .claude/skills/            # project-local reusable skills
```

## Source-of-truth hierarchy

When sources conflict, resolve in this order — and if a real conflict appears, raise it rather than silently picking one:

1. **The user**, in conversation
2. **[docs/specs/](docs/specs/)** — requirements, data model, validation rules, API contract
3. **[docs/guidelines/](docs/guidelines/)** — visual layout, component choices, copy
4. **This file** — conventions and defaults

Mockups govern *how it looks*; the spec governs *what the rules are*. A mockup that omits a field the spec requires is an incomplete mockup, not a decision to drop the field.

## Working rules

**Never invent requirements.** If a field, endpoint, screen, validation rule, or technology choice isn't in the spec, the mockups, or something the user said — ask. A plausible-sounding guess is worse than a question, because it will be trusted and built on.

**Keep the plan current.** [docs/plans/project-initialization-plan.md](docs/plans/project-initialization-plan.md) tracks every step with a status (`Pending` / `In Progress` / `Done` / `Blocked` / `Skipped`). Update the status in the *same turn* you finish a step, and add steps that emerge mid-work rather than leaving them untracked. The plan is only useful if it reflects reality.

**Validation lives on the backend.** Client-side validation is for UX responsiveness; the API must independently enforce every rule. Never rely on the UI to keep bad data out.

**Ask before pushing.** Commit locally when it makes sense, but confirm with the user before pushing to `origin`.

## Commands

```bash
# Backend — run the API on http://localhost:5080
cd src/backend && dotnet run --project EmployeeApi --launch-profile http

# Backend — run tests
cd src/backend && dotnet test

# Frontend — dev server on http://localhost:5173
cd src/frontend && npm run dev

# Frontend — type-check and build
cd src/frontend && npm run build
```

The frontend expects the API at `http://localhost:5080` (override with `VITE_API_URL`), and the API's CORS policy allows `http://localhost:5173`. Both need to be running for the UI to load data.

## Before changing build config

[docs/stack-notes.md](docs/stack-notes.md) records the setup decisions that look arbitrary but aren't — a pinned package version that prevents a compile error, a TypeScript setting that forbids idiomatic syntax, a test-isolation constraint that makes count assertions flaky. Read it before upgrading packages or editing `tsconfig`/`vite.config`/`.csproj`, and add to it whenever you lose time to a non-obvious build failure.

## Backend conventions

- Nullable reference types enabled; treat warnings as signal.
- DTOs at the API boundary — never expose the EF entity directly for writes.
- Validation via DataAnnotations plus explicit checks for cross-field rules (age, hire date) and uniqueness (email, national ID).
- Return `ProblemDetails`-shaped errors so the frontend can render field-level messages consistently.
- Status codes: `201` create, `200` read/update, `204` delete, `400` validation, `404` missing id, `409` duplicate email/national ID.
- Seed a few employees at startup so the UI isn't empty on first run — the in-memory store resets on every restart.

## Frontend conventions

- Shadcn UI components (`button`, `input`, `select`, `table`, `dialog`, `form`, `label`, `radio-group`, `sonner`) — add via the shadcn CLI rather than hand-rolling equivalents.
- `react-hook-form` + `zod` for form state and validation; the zod schema should mirror the backend's rules so the two don't drift.
- Surface API field errors on the corresponding inputs, not just as a toast.
- Visual details (colors, spacing, table columns, copy) come from [docs/guidelines/employees/ui-guidelines.md](docs/guidelines/employees/ui-guidelines.md), which describes the PNG mockups in that folder. Read it before building or changing a screen.

## Out of scope
Authentication, persistent storage, pagination/search/sorting, and deployment. Don't add these unless asked — the lab is time-boxed and scope creep is the main risk.
