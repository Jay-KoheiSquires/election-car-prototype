# Repository Guidelines

## Project Structure & Module Organization
- Root app: `prototype/` (Next.js + TypeScript). Key dirs:
  - `pages/` (routes), `component/` (UI; atoms/molecules/organisms), `features/` (domain logic),
  - `hooks/`, `utils/`, `constants/`, `public/`, `styles/`, `docs/`.
  - Tests: `__tests__/` (unit/integration), `e2e/` (Playwright).
- A legacy app also exists under `../election_car_rental_lab/`; contributions here should follow similar patterns.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server at `http://localhost:3000`.
- `npm run build`: Production build via Next.js.
- `npm start`: Run the built app.
- `npm test`: Run Jest tests once.
- `npm run test:watch`: Watch mode for Jest.
- `npm run test:coverage`: Jest with coverage (targets `features/`, `hooks/`, `utils/`).
- `npx playwright test`: Run E2E tests in `e2e/` (uses `playwright.config.ts`).

## Coding Style & Naming Conventions
- TypeScript first; 2-space indentation; prefer functional React components.
- Components: PascalCase (`component/organisms/RapForm.tsx`), hooks: `use*` camelCase (`hooks/useGetWindowSize.ts`).
- Utilities/constants: camelCase files; exported constants in UPPER_SNAKE_CASE when appropriate.
- Avoid default exports for shared modules; prefer named exports.
- Lint/format: `npm run lint` (ESLint + `eslint-config-next`); Prettier is included—format on save recommended.

## Testing Guidelines
- Unit/integration: Jest + RTL in `__tests__/` or alongside sources as `*.test.ts(x)`/`*.spec.ts(x)`.
- E2E: Playwright in `e2e/`; base URL `http://localhost:3000` with dev server auto-start.
- Aim for meaningful coverage on `features/`, `hooks/`, `utils/`; keep UI tests focused and resilient.
- Snapshots sparingly; prefer explicit assertions.

## Commit & Pull Request Guidelines
- Commit style follows Conventional Commits: `feat: ...`, `fix: ...`, `refactor: ...` (scope optional).
- Keep subjects imperative and under ~72 chars; include rationale in body when non-trivial.
- PRs must include: concise summary, linked issues (`Closes #123`), screenshots for UI changes, and updated tests.
- Ensure `npm run lint` and `npm test` pass; run `npx playwright test` for affected flows.

## Security & Configuration Tips
- Copy `.env.example` to `.env` for local config; never commit secrets.
- Review `next.config.js` and `playwright.config.ts` when changing build or E2E behavior.
