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
                                    <UtilsLoadingComp :loadingState="loadingState" color="neutral">
                                        <UButton type="submit" color="neutral">
                                            Create
                                        </UButton>
                                    </UtilsLoadingComp>
                                </UForm>
                            </template>
                        </UModal>
                        <div class="my-5 h-[calc(100vh-150px)] overflow-y-auto">
                            <template v-if="storage.notesExist == noteExistType.EXIST && storage.notes.length > 0">
                                <notesNoteCard page="dashboard"
                                    v-for="(note, idx) in filteringSearch(storage.notes, searching)" :key="note.id"
                                    :idx="idx" :note="note" />
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
                                v-if="storage.notesArchivedExist == notesArchivedExistType.EXIST && storage.archivedNotes.length > 0">
                                <notesNoteCard page="archived"
                                    v-for="(note, idx) in filteringSearch(storage.archivedNotes, searching)"
                                    :key="note.id" :idx="idx" :note="note" />
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
                        <template v-if="$route.name == 'dashboard-id'">
                            <utilsArchivableComp name="Archived" />
                        </template>
                        <template v-if="$route.name == 'archived-id'">
                            <utilsArchivableComp name="Unarchived" />
                        </template>
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

                                <UtilsLoadingComp :loadingState="loadingState" color="neutral">
                                    <UButton label="Delete" color="neutral"
                                        @click="doDeleteNote($route.params.id as string, $route.name as string)" />
                                </UtilsLoadingComp>
                            </template>
                        </UModal>
                    </div>
                </template>
            </div>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import { toast as vueToast } from 'vue-sonner';
import { deleteNote, insertInitialNote } from '~/lib/fetch';
import { useSessionStore } from '~/store/storage';
import { type noteType, noteExistType, notesArchivedExistType } from "~/types/types";

const slotData = defineSlots()

const storage = useSessionStore()

type noteKey = keyof noteType

const openCreateInitialNote = ref(false)
const openConfirmationDelete = ref(false)

const loadingState = ref(false)

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
    loadingState.value = true
    if (event.data.title) {
        createInitialNote(event.data.title);
    } else {
        loadingState.value = false
    }
}

const filterByTag = (notes: noteType[]) => {

    const query = useRoute().query
    if (Object.keys(query).length >= 1) {
        return notes.filter((row) => row.tags.some((tag) => tag.name == query.q))
    } else {
        return notes;
    }
}

const filteringSearch = (notes: noteType[], searchQuery: { search: string }) => {

    if (searchQuery.search.trim() != '') {
        let result = filterByTag(notes).filter((row) => {
            return Object.keys(row).some((idx) => {
                return String(row[idx as noteKey]).toLowerCase().indexOf(searchQuery.search.toLowerCase()) > -1
            })
        })
        return result;
    } else {
        return filterByTag(notes);
    }
}

const doDeleteNote = async (id: string, routeName: string) => {
    loadingState.value = true
    const result = await deleteNote(id.split("_")[1])

    if (result) {
        if (routeName == 'dashboard-id') {
            storage.removeNoteById(id)
        } else {
            storage.removeArchivedNoteById(id)
        }

        navigateTo(`/${routeName.split('-')[0]}`)
        console.log(storage.notes, storage.archivedNotes, id.split("_"))
        vueToast.success("Successfully deleted", {
            description: 'The note has been deleted.',
        });
    }
    loadingState.value = false
    openConfirmationDelete.value = false;
}

const createInitialNote = async (title: string) => {
    loadingState.value = true
    const result = await insertInitialNote(title, storage.credential.id)
    if (result) {
        vueToast.success("Successfully created", {
            description: 'The note has been created.',
        });
        storage.addNote(result)
    }

    loadingState.value = false
    openCreateInitialNote.value = false
}

</script>