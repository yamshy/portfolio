# Conventional Commit PR Title (required)

Please set the PR title in the format:

`type(scope?): short imperative summary`

**Requirements:**

- Subject must start with lowercase letter
- Keep subject under 72 characters
- Use imperative mood ("add" not "adds" or "added")

**Examples:**

- `feat(auth): add OAuth login`
- `fix(api): handle null user id`
- `chore: bump dependencies`

**Allowed types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

**Note:** The PR title becomes the squash commit message on merge. It will be validated by CI to ensure it matches conventional commit format.

---

## Summary

- What problem does this PR solve?
- What is the solution at a high level?

## Screenshots/Recordings (if UI)

## Breaking Changes

- If any, describe clearly and include `BREAKING CHANGE:` in body.

## Checklist

- [ ] Title follows Conventional Commits
- [ ] Tests added/updated (if applicable)
- [ ] Docs updated (if applicable)
