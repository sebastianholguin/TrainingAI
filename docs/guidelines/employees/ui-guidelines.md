# Employee Screens — UI Guidelines

Written from the mockups in this folder. The PNGs are the visual source of truth; this file makes their decisions explicit so they survive into code.

| Mockup | Screen |
|---|---|
| `Employee Directory.png` | Employee list |
| `Add Employee.png` | Create / edit form |
| `Delete Confirmation.png` | Delete confirmation dialog |

## Design tokens

| Token | Value | Used for |
|---|---|---|
| Primary | Indigo/violet `#4F46E5` (`indigo-600`) | Primary buttons, active nav, email links, avatar-adjacent accents |
| Primary hover | `#4338CA` (`indigo-700`) | Button hover |
| Active nav background | `#EEF0FE` (`indigo-50`) | Selected sidebar item |
| Page background | `#F5F6F8` (`slate-50` / `gray-50`) | App canvas |
| Surface | `#FFFFFF` | Cards, table, dialog, top bar |
| Border | `#E5E7EB` (`gray-200`) | Card edges, table row dividers, inputs |
| Text primary | `#111827` (`gray-900`) | Headings, table cells |
| Text muted | `#6B7280` (`gray-500`) | Subtitles, column headers, placeholders |
| Destructive | `#DC2626` (`red-600`) | Delete button, delete dialog icon |
| Destructive surface | `#FEE2E2` (`red-100`) | Circular icon background in delete dialog |

Cards and dialogs use a generous corner radius (~12px, `rounded-xl`) with a soft, low-opacity shadow. Inputs are `rounded-md` with a 1px border.

## Layout shell

- **Top bar** (white, full width, bottom border): square app icon in indigo, then the title **"HR Systems - Workshop Session 1"** in bold.
- **Sidebar** (left, ~256px, sits on the page background — not a separate white panel): heading **"HR Portal"** in bold with muted subtitle **"Foundation Layer"**, then nav items with a leading icon: `Dashboard`, `Employees`. The active item (`Employees`) gets the indigo-50 pill background with indigo text; inactive items are muted gray.
- **Main content**: page title, muted one-line subtitle, and a right-aligned primary action button on the same row as the title.

Dashboard is a nav item only — no dashboard screen is in scope for this lab. It can render a placeholder.

## Employee Directory (list)

Header row: **"Employee Directory"** (large, bold) with subtitle **"Manage and view all personnel records"**; **"+ Add Employee"** primary button right-aligned.

The table sits in a white card. Column headers are uppercase, small, letter-spaced, muted. Columns, in order:

| Column | Rendering |
|---|---|
| NAME | Circular gray avatar with the person's initials (e.g. `JD`), then the full name |
| NATIONAL ID | Plain text (mockup shows a dashed format, e.g. `482-99-1022` — display exactly what was stored, don't reformat) |
| TITLE | Plain text |
| HIRE DATE | Formatted `MMM dd, yyyy` — e.g. `Jan 12, 2021` |
| COUNTRY | Plain text |
| GENDER | Plain text |
| EMAIL | Indigo link (`mailto:`) |
| ACTIONS | Two icon-only ghost buttons: pencil (edit), trash (delete) |

Rows are separated by a light border and have a subtle hover background. Include an empty state for when no employees exist, and a loading state while fetching — neither appears in the mockup, so keep both visually quiet and consistent with the muted text style.

## Add / Edit Employee (form)

Centered content, max width ~680px. Title **"Add New Employee"** (bold, large) with subtitle **"Session 1: Workshop Foundation - Enter the details of the new hire below."** For edit mode, use "Edit Employee" and an equivalent subtitle.

The form is a white card with fields in a **two-column grid** (single column on mobile), in this order:

| Left | Right |
|---|---|
| Full Name — `e.g. John Doe` | Email Address — `john.doe@company.com` |
| National ID — `ID Number` | Hire Date — date input, `mm/dd/yyyy` |
| Job Title — **select**, placeholder `Select Title` | Country — `e.g. United States` |
| Country Code — `+1` | Phone Number — `(555) 000-0000` |
| Date of Birth — date input | *(empty)* |

Gender sits below the grid as a full-width **radio group**: `Male`, `Female`, `Other`.

A horizontal divider separates the fields from the footer actions, which are right-aligned: **Cancel** (ghost/text button) then **Save Employee** (indigo primary).

Below the card, a small centered muted footer: a graduation-cap icon and **"HR SYSTEM TRAINING SESSION 1"** in uppercase letter-spaced text.

### Notes on field decisions

- **Date of Birth** is absent from the mockup but required by the spec, and the spec governs data rules. It's placed at the end of the grid so the mockup's established order is preserved.
- **Phone** is split into `Country Code` + `Phone Number` per the mockup, so the backend stores them as two fields.
- **Job Title** is a dropdown per the mockup. The mockup doesn't enumerate the options; the seeded values (`Senior Systems Architect`, `Principal Designer`, `Frontend Lead`, plus a few common titles) are used as the list — confirm with the user if the real list matters.
- **Gender** offers exactly three options here (`Male` / `Female` / `Other`), narrowing the spec's initial four.

Validation errors render inline beneath the offending field in the destructive color; the field border also turns destructive. Errors returned by the API map onto the same fields rather than only appearing as a toast.

## Delete Confirmation (dialog)

A modal over a dimmed backdrop, centered, ~440px wide, white, generous corner radius.

- Circular light-red badge at the top center containing a red trash/delete icon.
- Title **"Delete Employee?"** — bold, centered.
- Body, centered and muted: *"Are you sure you want to delete this record? This action cannot be undone and will permanently remove all data associated with this employee."*
- Two equal-width buttons side by side: **Cancel** (white with border) and **Delete** (solid red).

Build this with the Shadcn `alert-dialog` so focus trapping and Escape-to-close come for free. The delete button should show a pending state while the request is in flight.

## Things visible in mockups that are NOT in scope

`Delete Confirmation.png` shows a richer surrounding app — a search bar, `Payroll` and `Documents` nav items, tabs, and a `Status` (Active / On Leave) column. Those belong to a later session's design and are not part of this lab. Build only what the Employee Directory mockup shows.
