#!/usr/bin/env bash
# PreToolUse hook (Bash matcher): blocks `git push` and `gh pr create` unless the
# backend test suite and frontend build both pass RIGHT NOW. Deliberately re-runs
# both every time rather than trusting a plan-file "Done" status or a prior run,
# since either can go stale the moment someone edits a line after the last check.
# Plain `git commit` is intentionally left ungated so local commits stay fast.
set -uo pipefail

input="$(cat)"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

# Only gate the two commands that send code somewhere else. Anything else (including
# git commit, git status, git diff, etc.) passes through untouched.
if ! printf '%s' "$command" | grep -q 'git push' && ! printf '%s' "$command" | grep -q 'gh pr create'; then
  exit 0
fi

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
backend_dir="$project_dir/src/backend"
frontend_dir="$project_dir/src/frontend"
backend_log="$(mktemp)"
frontend_log="$(mktemp)"
failures=()

if [ -d "$backend_dir" ]; then
  if ! (cd "$backend_dir" && dotnet test) >"$backend_log" 2>&1; then
    failures+=("BACKEND TESTS FAILED (dotnet test in src/backend):
$(tail -n 40 "$backend_log")")
  fi
else
  failures+=("Expected backend project at $backend_dir but it does not exist.")
fi

if [ -d "$frontend_dir" ]; then
  if ! (cd "$frontend_dir" && npm run build) >"$frontend_log" 2>&1; then
    failures+=("FRONTEND BUILD FAILED (npm run build in src/frontend):
$(tail -n 40 "$frontend_log")")
  fi
else
  failures+=("Expected frontend project at $frontend_dir but it does not exist.")
fi

rm -f "$backend_log" "$frontend_log"

if [ ${#failures[@]} -gt 0 ]; then
  reason="Blocked: this command sends code out of your machine, and at least one required check failed just now.

$(printf '%s\n\n' "${failures[@]}")
Fix the failure(s) above, then retry."
  reason_json="$(printf '%s' "$reason" | jq -Rs .)"
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":%s}}' "$reason_json"
  exit 0
fi

exit 0
