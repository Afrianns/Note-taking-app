<template>
    <Toaster richColors />
    <slot />
</template>
<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import { useSessionStore } from '~/store/storage';

let storage = useSessionStore()

onMounted(() => {
    if (localStorage.getItem("nuxt-color-mode")) {
        storage.themeMode = localStorage.getItem("nuxt-color-mode") as string;
    }
    storage.initialThemeMode();
})



</script>