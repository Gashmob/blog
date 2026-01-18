// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    site: "https://blog.ktraini.com",
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [sitemap(), vue()],
    security: {
        checkOrigin: true,
    },
});
