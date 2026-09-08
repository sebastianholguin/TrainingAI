---
name: mockup-to-ui
description: Turn design mockups (PNG/JPG screenshots, Figma exports, wireframes) into a written UI guidelines document and then into working frontend code. Use this whenever a project has visual designs to build from — a docs/guidelines or design folder with images, mockups attached to the conversation, or the user says "build this screen from the mockup", "match the design", "here are the designs". Also use before changing a screen that already has mockups, so the change stays faithful to them. Read every mockup and write the guidelines file BEFORE writing component code.
---

# Mockup to UI

Turn visual designs into code without losing their decisions along the way. The method has two phases: **extract the design into a written guidelines document**, then **implement from that document**. Skipping straight to components feels faster and reliably costs more, because every judgment call you made while squinting at a PNG evaporates the moment the task ends.

## Why write a guidelines file first

A mockup is an image. It can't be grepped, diffed, reviewed, or referenced from a code comment, and six weeks later nobody remembers whether that button was `#4F46E5` or `#4338CA`. Converting it into a written artifact does three things code alone can't:

1. **Forces implicit decisions to become explicit.** You cannot write "primary: `#4F46E5`" without deciding that this indigo is *the* primary, not a one-off.
2. **Surfaces conflicts before they're expensive.** Comparing the mockup against the spec on paper catches missing fields and contradictions while they're still a question, not a rewrite.
3. **Outlives the image.** The next person — or the next session — reads prose, not pixels.

The guidelines file lives next to the mockups (e.g. `docs/guidelines/<area>/ui-guidelines.md`) and states plainly that the images are the visual source of truth and the file records their decisions.

## Phase 1 — Extract

**Read every mockup image before writing anything.** Not a sample. Details that look decorative in one screen are often load-bearing in another.

Then build the guidelines document:

**Design tokens.** A table of semantic role → value: primary, primary-hover, background, surface, border, text primary, text muted, destructive, and the radius/shadow conventions. Name the *role*, not the color — "primary" survives a rebrand, "indigo" doesn't. Sample actual pixel values rather than guessing at names; "looks like Tailwind indigo-600" is a hypothesis, `#4F46E5` is a fact.

**Layout shell.** The persistent chrome: top bar, sidebar, nav items and their icons, which item shows as active, content max-widths.

**Per screen.** For each mockup: the exact heading and subtitle copy (transcribe it verbatim — copy is a design decision), the component used for each element, field order, column order, and how values are formatted. Date formats especially: `Jan 12, 2021` is a spec, not a suggestion.

### The two ways mockups mislead you

This is the part that matters, and it's why reading images casually goes wrong.

**They show more than is in scope.** Mockups get reused and edited from other screens. A delete-confirmation mockup may sit on top of a fuller app — extra nav items, a search bar, a status column, tabs — none of which belongs to the thing you were asked to build. Building it all is scope creep that looks like diligence. End the guidelines file with an explicit **"visible in mockups but NOT in scope"** section listing what you deliberately ignored, so the next reader doesn't "fix" the omission.

**They show less than you must build.** Mockups show the happy path: a table with three tidy rows. They almost never show the empty state, the loading state, the error state, the pending state on a submit button, validation errors, or long-text overflow. These are not optional — they're most of the real experience. Note them explicitly in the guidelines with a rule for how they should look (usually: quiet, consistent with the muted text style), because you're designing them yourself and that decision deserves recording.

### Reconcile against the spec

Compare every field, control, and rule in the mockups against the written spec. Where they disagree — a field the spec requires but the form omits, a free-text field the mockup makes a dropdown, an enum with different options — **stop and ask the user which wins**. Don't quietly pick. The useful default framing: mockups govern *how it looks*, the spec governs *what the rules are*, so a mockup missing a required field is usually an incomplete mockup rather than a decision to drop the field — but confirm rather than assume, and record the resolution in the guidelines so the conflict isn't rediscovered later.

## Phase 2 — Implement

**Map tokens to the framework's theme, don't hardcode.** If the project uses a design system with CSS variables (Tailwind + shadcn, MUI, Chakra), override the theme's tokens once so every component inherits the palette. Hardcoding `bg-[#4F46E5]` on individual elements produces a codebase where rebranding means grepping hex codes, and where half the components quietly stay the default color.

**Prefer the design system's real components** over hand-rolled equivalents. A dialog built from the library's `alert-dialog` gets focus trapping, escape-to-close, and scroll locking for free; a hand-built one gets none of them and nobody notices until someone tries to use a keyboard.

**Transcribe copy exactly.** Retyping "Manage and view all personnel records" from memory as "Manage all personnel records" is a silent, uncatchable regression.

**Build the states the mockup didn't show**, per the rules you wrote down in phase 1.

## Phase 3 — Verify against the image

Run the app and look at it. Screenshot the built screen and compare it against the mockup side by side — spacing, weights, column order, the active nav item, the date format. This is the step that catches the things reading code cannot: a heading two sizes too small, a table column in the wrong position, an avatar circle that isn't a circle.

Then exercise the interactions the mockup implies but can't show: submit the form empty and confirm validation renders where you said it would, trigger the error state, open the dialog. A screen that looks right and doesn't work is not done.
