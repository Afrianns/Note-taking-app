<template>
    <NuxtLayout name="settings-setting">
        <div class="flex max-lg:flex-col gap-x-4 my-3">
            <URadioGroup indicator="end" size="xl" color="primary" v-model="radioValue"
                :ui="{ item: 'mb-3 lg:w-[25rem] flex items-center', description: 'text-main-700' }"
                @click="setPreferences" variant="card" :items="items" />
            <div class="mt-10 lg:mt-auto mx-auto">
                <UButton label="Save" type="submit" variant="soft" class="self-end px-10" size="xl" />
            </div>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">

import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui';

const mode = useColorMode()
const radioValue = ref<RadioGroupValue>('system')

onMounted(() => {
    mode.preference = radioValue.value as string;
})

const setPreferences = computed(() => {
    mode.preference = radioValue.value as string;
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