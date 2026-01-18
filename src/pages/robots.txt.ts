import type { APIRoute } from "astro";

const getRobotsTxt = (sitemap_url: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemap_url.href}
`;

export const GET: APIRoute = ({ site }) => {
    const sitemapURL = new URL("sitemap-index.xml", site);
    return new Response(getRobotsTxt(sitemapURL));
};