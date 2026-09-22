# Content Collections (Content Layer API)

Open this when modeling structured content: a blog, docs set, product catalog, or any set of
"related, structurally identical data" (Astro's own definition of a collection).

## Where collections live

Astro 5 uses the **Content Layer API**. Collections are declared in `src/content.config.ts`
(not the pre-Astro-5 `src/content/config.ts` with implicit folder discovery).

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro:loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const authors = defineCollection({
  loader: file("./src/data/authors.json"), // single file, entries need a unique `id`
  schema: z.object({ name: z.string(), bio: z.string() }),
});

export const collections = { blog, authors };
```

## The three required parts

1. **Loader** (required) — `glob()` for a directory of Markdown/JSON/YAML files, `file()` for
   a single file of entries with unique `id`s, or a custom loader (function or object) for a
   remote source (CMS, database, API) fetched at build time.
2. **Schema** (optional but recommended) — a Zod schema; validates and types frontmatter/data
   at build time. Supports basic types, arrays, and `reference()` to link to another collection.
3. **`collections` export** — registers every collection so `getCollection()`/`getEntry()` can
   find it. Forgetting to add a defined collection here makes it invisible at runtime.

## Reading entries

```ts
import { getCollection, getEntry } from "astro:content";

const posts = await getCollection("blog");
const filtered = await getCollection("blog", ({ data }) => !data.draft);
const one = await getEntry("blog", "my-post-slug");
```

Render Markdown/MDX body content with `render(entry)` → `{ Content }`.

## Live collections (request-time data)

For data that must be fresh on every request rather than baked in at build time:

```ts
// src/live.config.ts
import { defineLiveCollection } from "astro:content";
import { myLiveLoader } from "./loaders/my-live-loader";

export const collections = {
  products: defineLiveCollection({ loader: myLiveLoader() }),
};
```

Read with `getLiveEntry()` / `getLiveCollection()`. This requires on-demand rendering for the
pages that use it (see `references/deployment-and-adapters.md`) — it is not a drop-in
replacement for regular collections, it trades build-time speed for request-time freshness.

## Migration trap

Any example showing schema-only `defineCollection({ schema: ... })` with **no `loader`** and
implicit `src/content/<name>/` discovery is the pre-Content-Layer-API shape (Astro ≤4-style).
It will error or silently misbehave on Astro 5+. Always include an explicit `loader`.
