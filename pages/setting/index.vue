<template>
    <NuxtLayout name="settings-setting">
        <div class="flex max-lg:flex-col gap-x-4 my-3 h-[calc(100vh-150px)]">
            <URadioGroup indicator="end" size="xl" color="primary" v-model="storage.themeMode"
                :ui="{ item: 'mb-3 lg:w-[25rem] flex items-center', description: 'text-main-700' }"
                @click="setPreferences" variant="card" :items="items" />
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">

import type { RadioGroupItem } from '@nuxt/ui';
import { useSessionStore } from '~/store/storage';

const storage = useSessionStore()
const mode = useColorMode()

const setPreferences = computed(() => {
    mode.preference = storage.themeMode as string;
})

const items = ref<RadioGroupItem[]>([
    {
        icon: 'i-lucide-rocket',
        label: 'Dark',
        value: 'dark',
        description: 'Best for your easy contras interface.',
    },
    {
        label: 'Light',
        value: 'light',
        description: 'Set your interface for easy read in the dark.',
    },
    {
        label: 'System',
        value: 'system',
        description: 'Set your interface same as your computer.'
    }
])
</script>