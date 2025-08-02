<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps(["tagName"])

const selectFilter = ref((!!useRoute().query.q && useRoute().query.q == props.tagName))

const router = useRouter();

const items = computed(() =>
    [
        {
            label: 'Filter by',
            icon: 'i-lucide-user',
            type: 'checkbox' as const,
            checked: selectFilter.value,
            onUpdateChecked(checked: boolean) {
                selectFilter.value = checked
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
    console.log(useRoute().query)
    if (useRoute().query.q) {
        router.replace({ query: {} })
    } else {
        router.push({ query: { q: name } })
    }
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
