<template>
    <header
        class="fixed top-0 left-0 w-screen py-3 flex justify-evenly items-center z-50 backdrop-blur-xs shadow-xs shadow-shadow">
        <a href="/" class="flex items-center gap-6 no-underline">
            <img src="/logo.png" alt="Kevin" class="w-7 h-7"/>
            <h1 class="text-2xl font-bold">Keblo?</h1>
        </a>
        <div class="flex gap-2">
            <a v-bind:href="rss_url" title="RSS" class="header-button">
                <i class="fa-solid fa-rss"></i>
            </a>
            <button v-on:click="handleSwitchThemeClick" title="Switch theme" class="header-button">
                <i ref="switch_theme_button_icon" class="fa-solid fa-display"></i>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{ rss_url: string }>();

const switch_theme_button_icon = ref<HTMLElement>();

onMounted(() => {
    const saved = localStorage.getItem("theme");
    if (saved === null) {
        switch_theme_button_icon.value?.classList.add("fa-display");
        return;
    }

    const prefers_dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefers_dark) {
        switch_theme_button_icon.value?.classList.add("fa-moon");
    } else {
        switch_theme_button_icon.value?.classList.add("fa-sun");
    }
});

function refreshTheme(): void {
    const saved = localStorage.getItem("theme");
    const prefers_dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(saved || (prefers_dark ? "dark" : "light"));
}

function handleSwitchThemeClick(): void {
    const saved = localStorage.getItem("theme");
    switch (saved) {
        case "light":
            localStorage.theme = "dark";
            switch_theme_button_icon.value?.classList.add("fa-moon");
            break;
        case "dark":
            localStorage.removeItem("theme");
            switch_theme_button_icon.value?.classList.add("fa-display");
            break;
        default:
            localStorage.theme = "light";
            switch_theme_button_icon.value?.classList.add("fa-sun");
            break;
    }
    refreshTheme();
}
</script>
