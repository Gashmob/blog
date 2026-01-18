import { glob } from "astro/loaders";
import { type CollectionEntry, defineCollection, z } from "astro:content";

const posts = defineCollection({
    loader: glob({ pattern: "**/[^_]*.md", base: "./src/posts" }),
    schema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        date: z.date(),
        author: z.string(),
        tags: z.array(z.string()),
    }),
});

export const collections = { posts };

export type PostEntry = CollectionEntry<"posts">;
