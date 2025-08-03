<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const props = defineProps(["tagName", "checkFilter"])
const emit = defineEmits(["checklistFilter"])

const items = computed(() =>
    [
        {
            label: 'Filter by',
            icon: 'i-lucide-user',
            type: 'checkbox' as const,
            checked: props.checkFilter,
            onUpdateChecked(checked: boolean) {
                emit("checklistFilter", checked)
                filterByTag(props.tagName)
            }, onSelect(e: Event) {
                e.preventDefault()
            }
        },
        {
            label: 'Delete',
            icon: 'i-lucide-credit-card'
        }
    ] satisfies DropdownMenuItem[]
)


const filterByTag = (name: string) => {
    useQueryFilterTag(name)
}

</script>

<template>
    <UDropdownMenu :items="items" :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8
    }" :ui="{
        content: 'w-16'
    }">
        <UButton size="xs" icon="i-lucide-menu" color="neutral" variant="outline" />
    </UDropdownMenu>
</template>
