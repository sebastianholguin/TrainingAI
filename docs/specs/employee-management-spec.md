# Employee Management API + UI — Spec

## 1. Overview
A 2-hour lab exercise to build a RESTful API backed by an in-memory database, plus a frontend UI, to manage `Employee` records.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Backend | C# / .NET |
| Data store | Entity Framework Core — In-Memory Database provider |
| Frontend | React + Shadcn UI |
| Testing | xUnit |

- No persistent database — EF Core In-Memory provider is required, per lab scope (data resets on restart).
- No additional backend/frontend frameworks beyond the above unless noted otherwise.

## 3. Data Model

### Employee
| Field | Type | Required | Notes |
|---|---|---|---|
| id | string/int | auto-generated | Unique identifier |
| name | string | yes | Full name |
| email | string | yes | Must be a valid email format; unique across employees |
| nationalId | string | yes | Unique across employees |
| countryCode | string | yes | Phone country code, e.g. `+1` |
| phone | string | yes | Phone number without country code |
| country | string | yes | |
| gender | string (enum) | yes | `Male`, `Female`, `Other` |
| dateOfBirth | date (ISO 8601) | yes | Must be in the past; employee must be 18+ |
| officialTitle | string (enum) | yes | Job title, selected from a predefined list (see UI guidelines) |
| hireDate | date (ISO 8601) | yes | Must not be before dateOfBirth + 18 years; cannot be in the future |

Field decisions that came from the mockups (see [ui-guidelines.md](../guidelines/employees/ui-guidelines.md)): phone is split into `countryCode` + `phone`, `officialTitle` is a dropdown rather than free text, and gender offers three options.

## 4. API Requirements

### 4.1 Conventions
- RESTful HTTP API
- JSON request/response bodies

### 4.2 Endpoints
| Method | Path | Description |
|---|---|---|
| GET | /employees | List all employees |
| GET | /employees/{id} | Get one employee by id |
| POST | /employees | Create a new employee |
| PUT | /employees/{id} | Update an existing employee (full replace) |
| DELETE | /employees/{id} | Delete an employee |

### 4.3 Validation & Error Handling
- Return `400 Bad Request` for missing/invalid fields, with a body describing which field(s) failed and why.
- Return `404 Not Found` when an `id` does not exist (GET/PUT/DELETE).
- Return `409 Conflict` when `email` or `nationalId` duplicates an existing employee (on create/update).
- Return `201 Created` on successful POST, `200 OK` on successful GET/PUT, `204 No Content` on successful DELETE.

## 5. Frontend UI Requirements

### 5.1 Screens/Views
- **Employee List** — table/grid showing all employees (at minimum: name, email, title, hire date), with actions to edit/delete each row and a button to add a new employee.
- **Create/Edit Employee Form** — form with all Employee fields, client-side validation matching the API's rules, submit/cancel actions.
- **Delete Confirmation** — confirm before deleting an employee.

### 5.2 Behavior
- List refreshes after create/edit/delete.
- Form displays field-level validation errors (both client-side and any returned by the API).
- Basic loading and error states (e.g. API unreachable, server error).

## 6. Out of Scope
- Authentication / authorization
- Persistent storage (database, file storage)
- Pagination, search, filtering, sorting (unless time allows)
- Deployment / hosting concerns

## 7. Acceptance Criteria
- [ ] All 5 endpoints implemented and functioning against the EF Core In-Memory store
- [ ] Validation rules enforced on the backend (not just the UI)
- [ ] UI (React + Shadcn UI) can list, create, edit, and delete employees end-to-end against the API
- [ ] Duplicate email/nationalId is rejected
- [ ] Invalid dates (future hire date, underage employee) are rejected
- [ ] xUnit test suite covers API endpoints and validation rules
