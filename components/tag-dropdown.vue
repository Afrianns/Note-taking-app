<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import { deleteTag } from '~/lib/fetch';

import { useSessionStore } from '~/store/storage';
import type { noteTagType, noteType, tagType } from '~/types/types';

import { toast as vueToast } from 'vue-sonner';

let storage = useSessionStore();

const openConfirmationDelete = ref(false)
const loadingState = ref(false)

let noteExistTagName = ref<(string | null)[]>([]);

const props = defineProps(["tagName", "checkFilter"])
const emit = defineEmits(["checklistFilter", "deleteTag"])

const items = computed(() =>
    [
        {
            label: 'Filter by',
            icon: 'i-lucide-list-filter',
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
                openConfirmationDelete.value = true;
                const noteExistTag = storage.notes.filter((note: noteType) => note.tags.some((tag: noteTagType) => tag.name == props.tagName));

                noteExistTagName.value = noteExistTag.map((note: noteType) => note.title);
            },
        }
    ] satisfies DropdownMenuItem[]
)


const filterByTag = (name: string) => {
    useQueryFilterTag(name)
}


const doDeleteTag = async () => {
    loadingState.value = true
    const tag = storage.tags.findIndex((tag: tagType) => tag.name == props.tagName);
    if (tag != -1) {
        const result = await deleteTag(storage.tags[tag].id)
        if (result == "success") {

            storage.getUserCredential()

            vueToast.success("Delete success", {
                description: "Successfully deleted tag",
            });

            storage.removeTagById(tag);

        } else {
            vueToast.error("Delete failed", {
                description: "Failed to delete tag",
            });
        }
    } else {
        vueToast.error("Delete failed", {
            description: "Tag not found",
        });
    }
    loadingState.value = false
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

    <UModal v-model:open="openConfirmationDelete" title="Delete Note" description="Confirmation Delete Note"
        :ui="{ footer: 'justify-end' }">

        <template #body>
            <h1>ARE YOU SURE WANT TO DELETE THIS TAG?</h1>
            <div v-show="noteExistTagName.length >= 1">
                <p v-for="note in noteExistTagName"><strong>[{{ note }}]</strong> use this tag</p>
            </div>
        </template>

        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />

            <utilsLoading :loadingState="loadingState" color="neutral">
                <UButton label="Delete" color="neutral" @click="doDeleteTag()" />
            </utilsLoading>
        </template>
    </UModal>
</template>
