/**
 * Keblo?
 * Copyright (C) 2026-Present  Kevin Traini
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
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
        story: z.optional(z.string()),
    }),
});

export const collections = { posts };

export type PostEntry = CollectionEntry<"posts">;
