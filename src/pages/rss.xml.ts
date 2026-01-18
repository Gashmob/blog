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
            link: `/${post.data.slug}`,
        })),
    });
}
