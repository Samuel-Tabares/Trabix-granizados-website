# Astro Skill Specification

## Intent

Give any future project using the Astro framework correct, current, framework-level Astro
knowledge — routing, content modeling, islands, styling setup, and deployment/rendering
modes — independent of any single project's specifics. This is the generic counterpart to a
project-scoped Astro skill (e.g. `STL_perfumes/web/.claude/skills/astro/`), which layers
project-specific stack facts and pitfalls on top of this one.

## Scope

In scope:
- Astro 5 framework fundamentals: init, project structure, routing, content collections
  (Content Layer API), islands/client directives, Tailwind v3 vs v4 setup, image
  optimization, rendering modes, and the four official first-party adapters.

Out of scope:
- Any single project's actual chosen stack, theme system, or business-specific conventions —
  those belong in that project's own `.claude/skills/astro/` (project scope), not here.
- Exhaustive coverage of every community integration or every possible deploy target beyond
  the four official adapters.

## Users And Trigger Context

- Primary users: any future project (STL Perfumes or otherwise) built with Astro, especially
  via `/skill-writer`'s Project Initializer mode injecting this into a new project's
  `.claude/skills/`.
- Common requests: initialize an Astro project, add routes/content/islands, set up Tailwind,
  choose a rendering mode or adapter, debug a build/hydration error.
- Should not trigger for: non-Astro frontend frameworks (Next.js, plain Vite/React, etc.).

## Runtime Contract

- Required first actions: none fixed — `SKILL.md` itself is the entry point and routes to
  references by task.
- Required outputs: none fixed — knowledge/reference skill, not a workflow.
- Non-negotiable constraints: don't recommend adding a server adapter to route around a
  static-build bug (see `SKILL.md` known issues table and
  `references/deployment-and-adapters.md`).
- Expected bundled files loaded at runtime: the matching `references/*.md` only when its
  specific branch (content modeling, islands, Tailwind, deployment) is relevant.

## Source And Evidence Model

Authoritative sources: see `SOURCES.md` (official docs.astro.build pages, fetched directly).

Useful improvement sources:
- positive examples: n/a yet
- negative examples: n/a yet
- commit logs/changelogs: Astro's own release notes, if this skill drifts from a new major version
- issue or PR feedback: n/a yet
- validation results: n/a yet

Data that must not be stored: none — framework-generic content only.

## Reference Architecture

- `SKILL.md` contains: framework overview, init command, project structure table, task
  routing table, known-issues table (10 entries), portability note.
- `references/` contains: `content-collections.md` (Content Layer API),
  `islands-and-client-directives.md` (hydration directives), `styling-tailwind.md` (v3 vs v4
  setup), `deployment-and-adapters.md` (rendering modes, four official adapters).
- `references/evidence/`: not used yet.
- `scripts/`: none — no automation needed for a documentation-class skill.
- `assets/`: none.

## Validation

- Lightweight validation: `uv run scripts/quick_validate.py <path>` from `skill-writer/`.
- Deeper validation: manual precision pass at authoring time.
- Holdout examples: none yet.
- Acceptance gates: none beyond the validator's structural check.

## Known Limitations

- Written against Astro 5's current Content Layer API and rendering-mode model; if a future
  Astro major version changes these mechanics, this skill needs a refresh (check
  `SOURCES.md` dates against current docs.astro.build).
- Deployment guidance covers only the four official first-party adapters, not third-party or
  self-hosted variants.
- Not yet exercised against a real second project — first real-world validation will be
  whichever future Astro project this gets injected into via `/skill-writer`.

## Maintenance Notes

- When to update `SKILL.md`: an Astro major version changes routing, content, or rendering
  fundamentals covered here.
- When to update `SOURCES.md`: any time this skill is re-verified against updated Astro docs.
- When to update `references/evidence/`: not applicable until iteration examples exist.
