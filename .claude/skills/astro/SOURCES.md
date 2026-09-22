# Sources

All fetched directly from official Astro docs during authoring (2026-07-04).

| Topic | URL | Used for |
|---|---|---|
| Install & setup | https://docs.astro.build/en/install-and-setup/ | Node version requirement, `npm create astro@latest` flags, `--add`/`--template` |
| Project structure | https://docs.astro.build/en/basics/project-structure/ | `src/`, `public/`, config files table in `SKILL.md` |
| Content collections | https://docs.astro.build/en/guides/content-collections/ | `references/content-collections.md` — Content Layer API, loaders, live collections |
| Integrations guide | https://docs.astro.build/en/guides/integrations-guide/ | `astro add` usage, official integrations list |
| Styling guide (Tailwind section) | https://docs.astro.build/en/guides/styling/ | `references/styling-tailwind.md` — v3 (`@astrojs/tailwind`) vs v4 (`@tailwindcss/vite`) |
| On-demand rendering | https://docs.astro.build/en/guides/on-demand-rendering/ | `references/deployment-and-adapters.md` — `output` modes, `prerender`, adapter list |
| Images guide | https://docs.astro.build/en/guides/images/ | Image optimization section in `SKILL.md` — `astro:assets`, `src/` vs `public/` |
| Deploy to Vercel | https://docs.astro.build/en/guides/deploy/vercel/ | Vercel-specific notes in `references/deployment-and-adapters.md` |

## Decisions

- **Scope: global library (`~/.claude/skills-library/astro/`), generic across future
  projects.** This is the counterpart to a project-scoped Astro skill created first for
  `STL_perfumes/web/` (`web/.claude/skills/astro/`) — that one encodes one project's actual
  stack and pitfalls; this one is deliberately stack-agnostic (covers both Tailwind v3 and
  v4, all four official adapters, static and SSR) so it's usable by any future Astro project,
  per explicit instruction to keep the two separate rather than merge them.
- **Shape: reference-backed-expert with 4 references**, wider than the project-scoped
  sibling's 2, because a library skill has to serve projects with different chosen
  sub-stacks (SSR vs SSG, different adapters, either Tailwind major version) — each of the 4
  references corresponds to a genuine branch decision (content model choice, hydration
  choice, Tailwind version choice, rendering-mode/host choice), not generic completeness for
  its own sake.
- **Not adapted from an upstream prompt/repo.** Synthesized directly from official Astro docs
  fetched during authoring; no equivalent "Astro agent rules" upstream source was identified
  (unlike e.g. `vercel-react-best-practices`, which mirrors an upstream AGENTS.md).
- **Not registered in `skills-lock.json`.** That file only tracks skills imported from
  external GitHub sources (e.g. `tdd`, `webapp-testing`); locally synthesized skills in this
  library (redis-js, stripe-best-practices, etc.) aren't tracked there either.

## Gaps

- No coverage of Astro's edge-case rendering features (server islands mixing static+dynamic
  within one component, `astro:env`, server actions) — add if a future project needs them.
- No coverage of community (non-official) deployment adapters or CMS integrations.
- Not yet validated against a second real Astro project (see `SPEC.md` Known Limitations).
