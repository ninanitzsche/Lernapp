# Claude Code Instructions – Nico's Snake App

Before making changes, read:
- `docs/AI_COLLABORATION_SPEC.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/ROADMAP_DESIGN.md`
- `docs/PHASE0_INVENTAR.md`
- `FEATURES.md`

## Mandatory rules
- You are the technical lead and implementation owner. ChatGPT is the Creative Director / UX Lead; the project owner has final authority.
- Follow the collaboration contract and approved design decisions. Do not silently reinterpret or override them.
- Preserve all existing features, learning logic, reward behavior, shop/terrarium mechanics, persistence and user data. A visual task does not authorize logic changes.
- Inspect the current repository, branch, relevant components and docs before acting.
- Prefer existing components and the smallest coherent change. Avoid unrelated refactors and new dependencies without justification.
- The design direction is Luminous Fantasy Adventure. Primary target: smartphone portrait; tablet and desktop remain responsive secondary targets.
- Keep learning tasks bright, calm, high-contrast and readable. Use toxic neon glow selectively.
- Preserve the original logo source `public/images/logo.webp`. Do not redraw or alter it without approval. The approved splash treatment uses the original on a dark background. A transparent derivative is postponed.
- Keep text, numbers, buttons and interactive UI as real components, not embedded in generated images.
- Do not push to `main` or merge without explicit approval. Work on `design/luminous-fantasy-adventure` unless told otherwise.
- Do not mark roadmap tasks complete until implemented and verified.
- Run relevant checks and report exactly what was and was not run. Never claim unverified success.
- Before committing, inspect the diff for unrelated changes, secrets and regressions.
- If requirements conflict or a critical detail is missing, stop and ask the project owner.

## Required completion report
Summarize:
1. What changed and which files.
2. Existing behavior explicitly preserved.
3. Tests, lint/type checks and build actually run, with results.
4. UI viewport(s) inspected, if applicable.
5. Remaining gaps, assumptions or blockers.
6. Branch and commit SHA, if committed.
