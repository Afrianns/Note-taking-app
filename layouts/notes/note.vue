<template>
    <UApp>
        <NuxtLayout name="home" v-slot="searching">
            <div class="flex">
                <div class="p-5 pl-5 w-full max-w-[18rem] mt-18 h-[calc(100vh-78px)]">
                    <UModal v-model:open="openCreateInitialNote" title="Create New Note"
                        description="Get starter with your note." :ui="{ footer: 'justify-end' }">
                        <UButton class="w-full text-center block ">+ New Note</UButton>
                        <template #body>
                            <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
                                <UFormField label="Title" name="title" required class="w-full">
                                    <UInput v-model="state.title" placeholder="Enter your title" class="w-full" />
                                </UFormField>

                                <USeparator class="my-2" />

                                <UButton type="submit">
                                    Create
                                </UButton>
                            </UForm>
                        </template>
                    </UModal>
                    <div class="my-5 h-[calc(100vh-150px)] overflow-y-auto">
                        <template v-if="storage.notesExist == noteExistType.EXIST && storage.notes.length > 0"
                            v-for="(note, idx) in filteringSearch(storage.notes, searching)" :key="idx">
                            <USeparator class="my-3" />
                            <nuxt-link :to="'/dashboard/' + idx + '_' + note.id"
                                class="p-3 rounded-md  space-y-2 cursor-pointer block"
                                :class="{ 'bg-main-300 dark:bg-main-950': `${idx}_${note.id}` == $route.params.id }">
                                <h2 class="font-bold text-xl">{{ note.title }}</h2>
                                <div class="flex gap-x-2">
                                    <span
                                        class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">dev</span>
                                    <span
                                        class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">daily</span>
                                </div>
                                <span class="text-muted text-xs font-medium">{{ useConvertDate(note.createdAt) }}</span>
                            </nuxt-link>
                        </template>

                        <template v-else-if="storage.notesExist == noteExistType.NOTEXIST">
                            <p class="text-center text-muted">There are no notes</p>
                        </template>

                        <template v-else v-for="id in [1, 2, 3]" :key="id">
                            <USeparator class="my-3" />
                            <section>
                                <USkeleton class="h-10 w-full" />
                                <div class="flex gap-x-2 my-3">
                                    <USkeleton class="h-5 w-10" />
                                    <USkeleton class="h-5 w-10" />
                                </div>
                                <USkeleton class="h-5 w-28" />
                            </section>
                        </template>
                    </div>
                </div>
                <USeparator orientation="vertical" class="h-screen" />
                <div class="p-5 flex gap-x-16 justify-left text-left mx-auto max-w-[1000px] w-full mt-18">
                    <slot />
                </div>
                <USeparator orientation="vertical" class="h-screen" v-show="$route.name == 'dashboard-id'" />
                <div class="mt-18 p-5 space-y-3 w-full max-w-[200px]" v-show="$route.name == 'dashboard-id'">
                    <UButton icon="material-symbols:archive-outline" color="neutral" variant="outline" size="lg" block
                        :ui="{ base: 'w-full' }">
                        Archived Note</UButton>
                    <UModal v-model:open="openConfirmationDelete" title="Delete Note"
                        description="Confirmation Delete Note" :ui="{ footer: 'justify-end' }">

                        <UButton icon="tabler:trash" color="neutral" variant="outline" size="lg" class="text-center"
                            block :ui="{ base: 'w-full' }">
                            Delete Note</UButton>
                        <template #body>
                            <h1>ARE YOU SURE WANT TO DELETE THIS NOTE?</h1>
                        </template>

                        <template #footer="{ close }">
                            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
                            <UButton label="Submit" color="neutral" @click="deleteNote($route.params.id as string)" />
                        </template>
                    </UModal>
                </div>
            </div>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { type noteType, noteExistType } from "~/types/types"

import { useSessionStore } from '~/store/storage';
const toast = useToast()

const slotData = defineSlots();

const storage = useSessionStore();

type noteKey = keyof noteType;

const openCreateInitialNote = ref(false)
const openConfirmationDelete = ref(false)
const state = reactive({
    title: undefined,
    tags: undefined
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.title) errors.push({ name: 'title', message: 'Title is Required' })
    return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    console.log(event.data)

    if (event.data.title) {
        createInitialNote(event.data.title);
    }
}

const filteringSearch = (notes: noteType[], searchQuery: { search: string }) => {
    if (searchQuery.search.trim() != '') {

        let result = notes.filter((row) => {
            return Object.keys(row).some((idx) => {
                return String(row[idx as noteKey]).toLowerCase().indexOf(searchQuery.search.toLowerCase()) > -1
            })
        })
        return result;
    } else {
        return notes;
    }
}

const deleteNote = async (id: string) => {
    const result = await $fetch("/api/note/deleteNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })

    openConfirmationDelete.value = false;
    if (result) {
        storage.notes.splice(id.split("_")[0] as unknown as number, 1);
        navigateTo("/dashboard")
        toast.add({ title: 'Success', description: 'The note has been deleted.', color: 'success' })
    }
}

const createInitialNote = async (title: string) => {

    const result = await $fetch("/api/note/createInitialNote", {
        method: "POST",
        body: {
            userId: storage.credential.id,
            title: title,
        }
    })

    if (result.length > 0) {
        toast.add({ title: 'Success', description: 'The note has been created.', color: 'success' })
        openCreateInitialNote.value = false;
        storage.notes.push(result[0] as unknown as noteType);
    }
}

</script>