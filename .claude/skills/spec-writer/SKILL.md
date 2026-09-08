---
name: spec-writer
description: Write a structured project/feature specification file (Overview, Technology Stack, Data Model, API Requirements, Frontend UI Requirements, Out of Scope, Acceptance Criteria) into a specs folder. Use this whenever the user asks to create, write, or draft a "spec", "specification", "requirements doc", or wants to document requirements for a new project, feature, lab exercise, or API before implementation — even if they don't use the word "spec" explicitly (e.g. "document what we're building", "write up the requirements for this"). Always interview the user for technology stack and restrictions before writing anything — never assume a language, framework, or database on their behalf.
---

# Spec Writer

Produce a single, concise Markdown spec file for a project or feature, following a fixed section structure. The core discipline of this skill is refusing to guess: a spec that quietly invents a field, endpoint, screen, or technology choice the user never mentioned is worse than no spec at all, because it will be trusted and built from. When information is missing, ask — don't default.

## Why technology stack gets asked first

It's tempting to skip straight to data models and endpoints, since those feel like "the real requirements." But technology choices (backend framework, frontend framework, database/persistence, required libraries, anything disallowed, deployment constraints) shape almost every other section — validation idioms, what "in-memory" vs "persistent" even means for the data model, what a "screen" looks like. Getting this wrong after the rest of the spec is written means rewriting the rest. Ask about it up front, explicitly, even if the user hasn't mentioned it.

## Process

1. **Get the project/feature description.** A sentence or two on what's being built and why (production feature, timed lab, prototype, internal tool, etc.) shapes tone and scope.

2. **Ask about technology stack and restrictions**, covering (skip only what's genuinely inapplicable, e.g. no frontend question if the user already said "backend only"):
   - Backend language/framework
   - Frontend framework, or "no frontend"
   - Database/persistence approach, and whether it must be persistent or can be in-memory/ephemeral
   - Any required libraries, tools, or specific versions
   - Anything explicitly disallowed or to avoid
   - Deployment/runtime constraints (local only, containerized, target OS, etc.)

   Do not default or infer any of these from context clues (e.g. don't assume React just because the project sounds web-ish). If the user hasn't told you, ask before writing the spec.

3. **Ask about the substance**: data model / entities and their fields, API endpoints (if there's a backend), UI screens (if there's a frontend), and anything explicitly out of scope. Take what the user dictates; ask follow-up questions for gaps (e.g. field types, required-ness, validation rules) rather than inventing plausible-sounding ones.

4. **Determine the output location.** Prefer a `docs/specs/` folder if a `docs/` directory exists in the project; otherwise a top-level `specs/` folder. Ask the user if it's ambiguous. Name the file `<feature-or-project-name>-spec.md`.

5. **Write the spec** using the structure below, omitting any section that doesn't apply (e.g. no API Requirements section for a frontend-only project). Keep it concise — tables over prose wherever a table fits (fields, endpoints, screens).

## Spec structure

```markdown
# [Project/Feature Name] — Spec

## 1. Overview
What's being built and why (context: lab, feature, prototype, etc.)

## 2. Technology Stack
| Layer | Technology |
|---|---|
| Backend | ... |
| Data store | ... |
| Frontend | ... |
| Testing | ... |

Plus any explicit restrictions or disallowed technologies as a short bullet list.

## 3. Data Model
### [Entity Name]
| Field | Type | Required | Notes |
|---|---|---|---|
...

(repeat per entity)

## 4. API Requirements (omit if no backend/API)
### 4.1 Conventions
(protocol, format, auth notes)

### 4.2 Endpoints
| Method | Path | Description |
|---|---|---|
...

### 4.3 Validation & Error Handling
Status codes and the conditions that trigger them.

## 5. Frontend UI Requirements (omit if no frontend)
### 5.1 Screens/Views
Bullet list, one line per screen: name — purpose.

### 5.2 Behavior
Key cross-cutting behaviors: refresh, validation display, loading/error states.

## 6. Out of Scope
Bullet list of what is explicitly NOT being built, to prevent scope creep.

## 7. Acceptance Criteria
Checklist (`- [ ]`) of concrete, verifiable conditions that define "done".
```

Renumber sections if one is omitted (e.g. if there's no Frontend section, "Out of Scope" becomes section 5, not 6) — don't leave gaps in the numbering.

## After writing

Show the user what was written and invite corrections — a spec is a draft of shared understanding, not a one-shot deliverable. If they mention new requirements later in the conversation, update the same file rather than leaving stale content behind.
