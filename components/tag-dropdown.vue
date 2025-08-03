<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import { deleteTag } from '~/lib/fetch';

import { useSessionStore } from '~/store/storage';
import type { tagType } from '~/types/types';

import { toast as vueToast } from 'vue-sonner';

let storage = useSessionStore();

const props = defineProps(["tagName", "checkFilter"])
const emit = defineEmits(["checklistFilter", "deleteTag"])

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
            },
            onSelect(e: Event) {
                e.preventDefault()
            }
        },
        {
            label: 'Delete',
            color: 'error',
            icon: 'i-lucide-trash',
            async onSelect() {
                const tag = storage.tags.findIndex((tag: tagType) => tag.name == props.tagName);
                if (tag != -1) {
                    const result = await deleteTag(storage.tags[tag].id)
                    if (result == "success") {
                        vueToast.error("Delete success", {
                            description: "Successfully deleted tag",
                        });

                        storage.removeTagById(tag);

                    } else {
                        vueToast.error("Delete failed", {
                            description: "Failed to delete tag",
                        });
                    }
                } else {
                    vueToast.error("Failed to delete tag", {
                        description: "Tag not found",
                    });
                }
            },
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
