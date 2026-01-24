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
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { PostEntry } from "../content.config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    if (!context.site) {
        return new Response("Site is not defined on the request context", {
            status: 500,
        });
    }

    const posts: PostEntry[] = await getCollection("posts");
    return rss({
        title: "Keblo?",
        description: "A collection of blog posts from Kevin Traini",
        site: context.site,
        trailingSlash: false,
        items: posts.map((post: PostEntry) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            author: post.data.author,
            link: `/post/${post.data.slug}`,
        })),
    });
}
