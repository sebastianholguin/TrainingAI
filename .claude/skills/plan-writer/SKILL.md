---
name: plan-writer
description: Write a structured, trackable plan file (ordered steps, each with a status like Pending/In Progress/Done/Blocked) into a plans folder — for project initialization, migrations, multi-session implementation work, or any task that spans more than one sitting and benefits from a persistent checklist. Use this whenever the user asks to "create a plan", "plan out" a project/feature, track setup/initialization steps, or wants a living checklist they and Claude can both update across sessions. Distinct from the spec-writer skill: a spec describes WHAT to build and its requirements; a plan describes the ORDERED STEPS and their current status to get there.
---

# Plan Writer

Produce a single Markdown plan file that tracks ordered steps toward a goal (project initialization, a migration, a multi-step feature build), where every step carries an explicit status. The point of this file is that it gets *revisited* — across sessions, possibly by a different person or a future Claude — so it must always reflect current reality, not just the plan as first imagined.

## Why per-step status matters

A plan without status is just a wishlist — nobody can tell what's actually done without re-deriving it from the code or asking around. Attaching a status to every step turns the file into a source of truth: at a glance, anyone (human or Claude) can see what's finished, what's next, and what's stuck. This only works if statuses are kept current — update the plan file in the same turn you complete a step, not as an afterthought.

## Process

1. **Get the goal.** What is this plan for — initializing a new project, migrating something, building a feature across multiple sessions? A sentence or two of context.

2. **Gather the steps.** Ask the user to dictate steps, or propose a draft ordering based on conversation context (e.g. what's already been done in this session) and confirm it with them before writing. Don't invent steps that weren't discussed or that don't make sense for the stated goal — if scope is unclear, ask rather than guessing.

3. **Assign initial statuses.** Anything already completed in the conversation gets `Done`; the immediate next actionable step is usually `In Progress` or `Pending`; anything blocked on a decision or external dependency gets `Blocked` with a note on what it's waiting for.

4. **Determine the output location.** Prefer `docs/plans/` if a `docs/` directory exists in the project; otherwise a top-level `plans/` folder. Name the file `<project-or-feature-name>-plan.md`.

5. **Write the plan** using the structure below.

## Status values

Use exactly these, so the file is scannable and greppable:
- `Pending` — not started
- `In Progress` — actively being worked on
- `Done` — complete
- `Blocked` — can't proceed; note *why* in the Notes column
- `Skipped` — deliberately not doing this step; note why (e.g. descoped)

## Plan structure

```markdown
# [Project/Feature Name] — Plan

## Goal
1-3 sentences: what this plan accomplishes and why.

## Steps

| # | Step | Status | Notes |
|---|---|---|---|
| 1 | ... | Done | ... |
| 2 | ... | In Progress | ... |
| 3 | ... | Pending | ... |

## Status Legend
- **Pending** — not started
- **In Progress** — actively being worked on
- **Done** — complete
- **Blocked** — can't proceed (see Notes for why)
- **Skipped** — deliberately not doing this (see Notes for why)
```

Keep the Notes column terse — a file path, a one-line reason, a date, or blank. It's a working log, not a narrative.

## Keeping it current

Whenever you (Claude) complete a step that appears in an existing plan file, update that file's status in the same turn — don't leave the plan stale. If new steps emerge mid-work that weren't in the original plan, add them rather than leaving them untracked. If the user reports something is now blocked or descoped, reflect that immediately.

When reusing this pattern for a new project, this skill (not the plan file itself) is what travels — write a fresh plan file per project rather than copying an old one's steps, since initialization steps genuinely differ across tech stacks and goals.
