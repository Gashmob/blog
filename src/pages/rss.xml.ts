import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { BlogEntry } from "../content.config";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    if (!context.site) {
        return new Response("Site is not defined on the request context", {
            status: 500,
        });
    }

    const blogs: BlogEntry[] = await getCollection("blogs");
    return rss({
        title: "Keblo?",
        description: "A collection of blog article",
        site: context.site,
        trailingSlash: false,
        items: blogs.map((blog: BlogEntry) => ({
            title: blog.data.title,
            description: blog.data.description,
            pubDate: blog.data.date,
            author: blog.data.author,
            link: `/${blog.data.slug}`,
        })),
    });
}
