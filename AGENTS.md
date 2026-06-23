# Project Rules

Use this file for rules that apply across the whole NorthlineGoods project.

## Development

- Keep changes focused on the requested task.
- Prefer existing project patterns before adding new abstractions.
- Do not commit secrets, local `.env` files, build output, logs, IDE folders, or dependencies.
- Use TypeScript types deliberately; avoid `any` unless there is a clear reason.

## Verification

- Run `npm run typecheck` after code changes.
- Run `npm run build` before committing larger frontend or server changes.

## Git Workflow

- Work on feature branches, not directly on `master`.
- Commit related changes together with clear commit messages.
- Open a PR when a feature branch has enough changes to review.
