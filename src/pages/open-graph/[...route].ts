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
import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";
import type { PostEntry } from "../../content.config.ts";

type PageData = {
    title: string;
    description: string;
};

const posts: Record<string, PageData> = Object.fromEntries(
    (await getCollection("posts")).map((post: PostEntry) => [post.data.slug, post.data]),
);

export const { getStaticPaths, GET } = await OGImageRoute<PageData>({
    param: "route",
    pages: {
        ...posts,
        main: {
            title: "Keblo?",
            description: "A collection of blog posts from Kevin Traini",
        },
    },
    getImageOptions: (path, page) => ({
        title: page.title,
        description: page.description,
        bgGradient: [[19, 20, 32]],
        logo: {
            path: "public/logo.png",
            size: [120],
        },
        border: {
            color: [29, 30, 48],
            width: 10,
        },
        padding: 60,
        font: {
            title: {
                color: [169, 173, 214],
                families: ["Open Sans"],
            },
            description: {
                color: [100, 107, 180],
                families: ["Open Sans"],
            },
        },
    }),
});
