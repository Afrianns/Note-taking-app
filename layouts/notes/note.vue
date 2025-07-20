<template>
    <UApp>
        <NuxtLayout name="home" v-slot="searching">
            <div class="flex">
                <div class="p-5 pl-5 w-full max-w-[18rem] mt-18 h-[calc(100vh-78px)]">
                    <div v-if="$route.name == 'dashboard' || $route.name == 'dashboard-id'">
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
                                <notesNoteCard page="dashboard" :idx="idx" :note="note" />
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
                    <div v-if="$route.name == 'archived' || $route.name == 'archived-id'">
                        <div class="mb-5 h-full overflow-y-auto">
                            <template
                                v-if="storage.notesArchivedExist == notesArchivedExistType.EXIST && storage.archivedNotes.length > 0"
                                v-for="(note, idx) in filteringSearch(storage.archivedNotes, searching)" :key="idx">
                                <notesNoteCard page="archived" :idx="idx" :note="note" />
                            </template>

                            <template v-else-if="storage.notesArchivedExist == notesArchivedExistType.NOTEXIST">
                                <p class="text-center text-muted">There are no archived notes</p>
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
                </div>
                <USeparator orientation="vertical" class="h-screen" />
                <div class="p-5 flex gap-x-16 justify-left text-left mx-auto max-w-[1000px] w-full mt-18">
                    <slot />
                </div>
                <template v-if="$route.name == 'dashboard-id' || $route.name == 'archived-id'">
                    <USeparator orientation="vertical" class="h-screen" />
                    <div class="mt-18 p-5 space-y-3 w-full max-w-[200px]">
                        <div v-show="$route.name == 'dashboard-id'">
                            <UButton icon="material-symbols:archive-outline"
                                @click="archivedNote($route.params.id as string)" color="neutral" variant="outline"
                                size="lg" block :ui="{ base: 'w-full' }">
                                Archived Note</UButton>
                        </div>
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
                                <UButton label="Submit" color="neutral"
                                    @click="deleteNote($route.params.id as string, $route.name as string)" />
                            </template>
                        </UModal>
                    </div>
                </template>
            </div>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { type noteType, noteExistType, notesArchivedExistType } from "~/types/types"

import { useSessionStore } from '~/store/storage';

const slotData = defineSlots();

const storage = useSessionStore();

type noteKey = keyof noteType;

const openCreateInitialNote = ref(false)
const openConfirmationDelete = ref(false)
const state = reactive({
    title: undefined,
    tags: undefined
})
let toast: any;

onMounted(() => {
    toast = useToast();
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.title) errors.push({ name: 'title', message: 'Title is Required' })
    return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
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

const archivedNote = async (id: string) => {
    const result = await $fetch("/api/note/archivedNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
            value: true
        }
    })

    console.log(result)

    let resultArrFirst = result['0' as keyof typeof result]
    if (result[1]) {
        storage.removeNoteById(id)
        storage.addArchivedNote(resultArrFirst['0' as keyof typeof resultArrFirst] as noteType)
        navigateTo("/dashboard")
        toast.add({ title: 'Success', description: 'The note has been archived.', color: 'success' })
    }
}

const deleteNote = async (id: string, routeName: string) => {
    const result = await $fetch("/api/note/deleteNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })

    openConfirmationDelete.value = false;
    if (result) {

        if (routeName == 'dashboard-id') {
            storage.removeNoteById(id)
        } else {
            storage.removeArchivedNoteById(id)
        }

        navigateTo(`/${routeName.split('-')[0]}`)
        console.log(storage.notes, storage.archivedNotes, id.split("_"))
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