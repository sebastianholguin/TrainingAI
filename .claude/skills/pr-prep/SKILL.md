---
name: pr-prep
description: Draft a pull request title and description from the current branch's changes — gathers the diff and commit log since the base branch, summarizes what changed and why, and writes a test plan checklist. Use whenever the user asks to "prepare a PR", "write a PR description", "get this ready for review", or is about to open a pull request and wants the description written first. Produces a draft to review, not a submitted PR — creating or opening the PR itself is a separate, explicit step the user takes (or asks for) afterward.
---

# PR Prep

Turn the commits on a branch into a PR description a reviewer can actually use. The draft is the deliverable — this skill does not run `gh pr create` itself; opening a PR is a "confirm first" action, so the user takes that step (or explicitly asks for it) once they've seen and approved the draft.

## Why draft separately from creating

A PR description written well answers "why" for a reviewer who has no context — not "what changed" (the diff already says that), but *why it changed*, what was tried, and what to focus review attention on. That takes the same care as writing the code, and it's wasted if it's inseparable from the act of opening the PR: the user can't review, edit tone, or add something you didn't know (a linked ticket, a screenshot, context from a conversation with a teammate) before it goes live. Drafting first, handing it back, keeps that editing window open.

## Process

1. **Establish the base.** Find the branch this diverged from (usually `main` or `master`) with `git status`/`git rev-parse --abbrev-ref HEAD` and the remote's default branch. If it's ambiguous, ask.

2. **Gather everything that will ship**, not just the latest commit:
   - `git log <base>..HEAD --oneline` for the full commit history on this branch
   - `git diff <base>...HEAD` (or `--stat` first if the diff is large) for the actual change
   - Read enough of the diff to understand the *shape* of the change, not just the file list — a reviewer's first question is usually "why did this touch 12 files" and the answer should be in the description, not something they have to reverse-engineer

3. **Check for a linked plan or spec.** If this project has a `docs/plans/` or `docs/specs/` folder (or the equivalent this project uses), check whether the branch's work maps to a tracked step — if so, reference it, since "implements step 14 of the initialization plan" is more useful to a reviewer than a description reconstructed purely from the diff.

4. **Write the draft** using the structure below.

5. **Show it to the user as a draft**, not as something already submitted. Ask if they want changes before they open the PR themselves (or ask you to, in a separate explicit step).

## PR description structure

```markdown
## Summary
1-3 bullet points: what changed and why. Lead with why if the why isn't obvious from
the diff alone — "why" is what a diff can't tell a reviewer on its own.

## Changes
Grouped by concern if the branch touches multiple areas (e.g. "Backend:", "Frontend:",
"Docs:") — a flat list of every file is not a summary. Mention anything a reviewer
would otherwise have to dig for: a renamed public API, a changed default, a migration.

## Test plan
Checklist format (`- [ ]`), concrete and checkable:
- Tests added/updated, and what they cover
- Manual verification steps actually performed (not just "should work")
- Anything explicitly NOT tested and why (e.g. "no test for the UI drag-and-drop path — needs manual QA")
```

Keep the title under ~70 characters, imperative mood ("Add employee delete confirmation", not "Added" or "Adding"). The description's job is to let a reviewer approve confidently without re-deriving your reasoning from the diff — write it as if you're handing off to someone who wasn't in the room.

## What NOT to do

Don't pad the summary with generic filler ("This PR improves the codebase by..."). Don't restate the diff line-by-line — that's what the "Files changed" tab is for. Don't claim testing that didn't happen; an honest "not tested, needs manual QA" is more useful to a reviewer than a checkbox that isn't true. If a project-level hook or CI gate requires tests to pass before a PR can be created, that's a separate, harder guarantee than anything a checklist in the description can assert — mention what you verified, but don't claim more.
