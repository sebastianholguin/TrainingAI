# Project & Assignment Screens — UI Guidelines

Written from the mockups in this folder. The PNGs are the visual source of truth for layout and style; this file records the decisions made where they conflicted with the written acceptance criteria (see the **Resolved conflicts** section) so those conflicts aren't rediscovered later.

| Mockup | Screen |
|---|---|
| `Project Management.png` | Project list |
| `New Project.png` | Create/edit project (embeds the Project-side assignment table) |
| `Assign New Employee.png` | Assignment dialog, reached from the Project view |

These reuse the same shell, tokens, and component library as [docs/guidelines/employees/ui-guidelines.md](../employees/ui-guidelines.md) — same indigo primary, same Shadcn components, same sidebar. Read that file first; this one only covers what's new or different for Projects.

## Layout shell — additions

- Sidebar gains a **Projects** nav item (briefcase icon), below Employees. Same active-state treatment (indigo-50 pill, indigo text) as the existing items.
- The mockups show slightly different top-bar subtitles per screen ("Admin Console", "Management Portal", "Coordinator View • Granular Control") — these read as placeholder/demo flavor text rather than a meaningful per-role system, and are not backed by anything in the acceptance criteria. Do not implement role-switching; keep the top bar consistent with what Session 1 already established ("HR Systems - Workshop Session 1" or equivalent), not this mockup's rotating subtitle.
- Breadcrumbs appear above the page title on nested screens (`Projects > Project Alpha > Assign Employee`, `Projects > Create New Project`). Build lightweight breadcrumbs the same way for Project screens; Employee screens didn't need them since they're only one level deep.

## Project Management (list)

Header: **"Project Management"**, subtitle-style eyebrow text above it in the mockup ("Coordinator View • Granular Control") — per the layout-shell note above, skip the rotating eyebrow copy; keep a plain descriptive subtitle consistent with the Employee Directory's style (e.g. "Manage projects and team assignments"). **"+ Add Project"** primary button, right-aligned, same as Employee Directory's "+ Add Employee".

Table columns, in order:

| Column | Rendering |
|---|---|
| PROJECT NAME | Project name (bold) with the internal id below in small muted text, formatted as `ID: {id}` using the plain database id — **not** the mockup's `PRJ-2023-01` scheme (see Resolved conflicts) |
| TEAM | Overlapping avatar stack for assigned employees, `+N` overflow badge past a small cap (mirror the mockup's visual, e.g. show first 2-3 avatars); when there's no room for avatars or as a simpler first pass, "{count} members" text is an acceptable fallback — pick one rendering and use it consistently, don't mix per-row |
| ACTIONS | Same two ghost icon buttons as the Employee Directory: pencil (edit), trash (delete) |

Do **not** implement: the colored status dot per row, the `PRJ-YYYY-NN` formatted id, sortable column headers, or pagination (`Page 1 of 3...`, Previous/Next) — see Resolved conflicts. Render every project unpaginated, same as the Employee Directory.

Empty/loading/error states: same pattern as `EmployeeDirectory.tsx` (quiet, muted text, a "Try again" action on error).

## Create/Edit Project (form)

Breadcrumb (`Projects > Create New Project`), title **"Create New Project"** (or "Edit Project"), subtitle **"Fill in the details below to initialize a new initiative."** White card, single column:

- **Project Name** — text input, placeholder `e.g. Infrastructure Overhaul`
- **Project Description** — textarea, placeholder `Describe the project goals and scope...`

Below the fields, an **Assigned Employees** section within the same card:
- Section header "Assigned Employees" with a right-aligned **"+ Add Employee"** button (ghost/outline, indigo text, person-plus icon) that opens the assignment dialog (see below) scoped to this project
- A table of currently-assigned employees: avatar, name (bold) + email (muted, below name), and a trash icon action to unassign
- A muted helper line below the table: "Assign team members to collaborate on this project."

Footer: divider, then right-aligned **Cancel** (ghost) and **Save Project** (indigo primary) — same pattern as the Employee form.

This is the Project-side half of the bidirectional assignment requirement: assigning happens inline on this screen via "+ Add Employee", not a separate full-page flow.

## Assign Employee (dialog) — both directions

Reached two ways per the acceptance criteria's bidirectional requirement:
- **From the Project view**: "+ Add Employee" on the Create/Edit Project screen (mockup: `Assign New Employee.png`, breadcrumb `Projects > Project Alpha > Assign Employee`)
- **From the Employee view**: a mirrored "Assign to Project" entry point on the Employee screen (no mockup provided — build with the identical visual pattern below, swapping which picker is shown)

Modal/card, centered, white, same corner radius and shadow as the Employee delete-confirmation dialog. Title **"Assign New Employee"** (or, from the Employee side, "Assign to Project") with a one-line subtitle explaining the two fields below it.

Fields:
- **{Employee Name | Project Name}** — a select/combobox listing the entities not yet assigned to this project (or projects the employee isn't yet on, from the other direction); placeholder `Select an employee` / `Select a project`
- **Start Date** — date input, `mm/dd/yyyy` placeholder, calendar icon. Confirmed in scope: the junction table carries a `StartDate`, so this field is real and required, not decorative.

Footer: right-aligned **Cancel** (ghost) and a primary button (**"Assign to Project"** / **"Assign to Employee"** depending on direction).

### Duplicate assignment error

Not shown in any mockup — this is a state we're designing, not one to copy. When the selected pair is already assigned (the API returns 409), show the error the same way the Employee form surfaces a 409 today: inline, tied to the picker field, in the destructive color, with a message that says plainly why it failed (e.g. "This employee is already assigned to this project."). Don't just toast it — the picker is the field the error is about.

## Resolved conflicts (mockup vs. acceptance criteria)

These were confirmed with the user rather than assumed:

- **Start Date**: mockup adds it, acceptance criteria don't mention it → **keep it**. The junction table (`EmployeeProject`) gets a `StartDate` column; it's a real, required field on every assignment, not mockup embellishment.
- **Colored status dot + `PRJ-YYYY-NN` formatted id**: neither is backed by the Project model (Name, Description only) → **omit both**, same as how Session 1 ignored the extra nav items/status column visible in the Delete Confirmation mockup's background app. Project keeps a plain auto-incrementing id.
- **Pagination** (`Page 1 of 3 (12 total projects)`, Previous/Next): CLAUDE.md already marks pagination out of scope for this repo → **still out of scope**, even with the larger 50-employee/10-project seed data. Render full unpaginated lists.
- **No Employee-side assignment mockup exists** → build one, mirroring the Project-side dialog's visual pattern exactly (title/subtitle/fields/footer layout), just swapping which entity is being picked.

## Things visible in mockups but NOT in scope

- Colored status dot per project row, and the `PRJ-2023-01` formatted project id (no backing field in the data model)
- List pagination and column sorting (`Project Name ↓`, `Team ↕`) on the Project list
- Per-screen rotating top-bar subtitles ("Admin Console" / "Management Portal" / "Coordinator View • Granular Control") — cosmetic variation across mockups, not a role system to implement
- Anything from the Employee mockups' out-of-scope list still applies (see [employees/ui-guidelines.md](../employees/ui-guidelines.md))
