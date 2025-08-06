<template>
    <UApp>
        <NuxtLayout name="home">
            <div class="flex">
                <div class="p-5 pl-5 w-full lg:max-w-[18rem] mt-18 h-[calc(100vh-78px)]"
                    :class="[$route.name == 'dashboard-id' || $route.name == 'archived-id' ? 'max-lg:hidden' : 'max-lg:block']">
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
                                    <UtilsLoading :loadingState="loadingState" color="neutral">
                                        <UButton type="submit" color="neutral">
                                            Create
                                        </UButton>
                                    </UtilsLoading>
                                </UForm>
                            </template>
                        </UModal>
                        <div class="my-5 h-[calc(100vh-150px)] overflow-y-auto">
                            <template v-if="storage.notesExist == noteExistType.EXIST && storage.notes.length > 0">
                                <notesNoteCard page="dashboard" v-for="(note, idx) in filterSearch" :key="note.id"
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
                                <notesNoteCard page="archived" v-for="(note, idx) in filterArchivedSearch"
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
                <div class="flex mt-18 max-lg:flex-col-reverse w-full"
                    :class="[$route.name == 'dashboard-id' || $route.name == 'archived-id' ? 'max-lg:flex' : 'max-lg:hidden']">
                    <div
                        class="p-5 flex gap-x-16 justify-left text-left mx-auto max-w-[1000px] w-full max-lg:h-[calc(100vh-149px)]">
                        <slot />
                    </div>
                    <template v-if="$route.name == 'dashboard-id' || $route.name == 'archived-id'">
                        <USeparator orientation="vertical" class="lg:h-[calc(100vh-78px)] hidden lg:block" />
                        <USeparator class="w-full lg:hidden" />
                        <div
                            class="p-5 w-full lg:max-w-[200px] gap-x-2 flex justify-between items-center lg:block lg:space-y-3">
                            <nuxt-link to="/dashboard">
                                <UButton icon="i-lucide-arrow-left" label="Back" size="lg" color="neutral"
                                    class="lg:hidden" variant="subtle" />
                            </nuxt-link>
                            <template v-if="$route.name == 'dashboard-id'">
                                <utilsArchivable name="Archived" />
                            </template>
                            <template v-if="$route.name == 'archived-id'">
                                <utilsArchivable name="Unarchived" />
                            </template>
                            <utilsDeletable />
                        </div>
                    </template>
                </div>
            </div>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import { toast as vueToast } from 'vue-sonner';
import { insertInitialNote } from '~/lib/fetch';
import { useSessionStore } from '~/store/storage';
import { type noteType, noteExistType, notesArchivedExistType } from "~/types/types";

const slotData = defineSlots()

const storage = useSessionStore()

const openCreateInitialNote = ref(false)

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
    if (Object.keys(query).length >= 1 && query.tag) {
        return notes.filter((row) => row.tags.some((tag) => tag.name == query.tag))
    } else {
        return notes;
    }
}

const filterSearch = computed(() => filteringSearch(storage.notes))
const filterArchivedSearch = computed(() => filteringSearch(storage.archivedNotes))

type noteKey = keyof noteType

const filteringSearch = (notes: noteType[]) => {
    let searchQuery = { ...useRoute().query }

    if (searchQuery && searchQuery.q) {

        let search = searchQuery.q as string;
        if (search.trim() != '') {
            let result = filterByTag(notes).filter((row) => {
                return Object.keys(row).some((idx) => {
                    return String(row[idx as noteKey]).toLowerCase().indexOf(search.toLowerCase()) > -1
                })
            })
            return result;
        }
    }
    return filterByTag(notes);
}

const createInitialNote = async (title: string) => {
    loadingState.value = true
    const result = await insertInitialNote(title, storage.credential.id)
    if (result) {
        vueToast.success("Successfully created", {
            description: 'The note has been created.',
        });
        storage.addNote({
            ...result,
            tags: result.tags.map((tag) => tag),
            createdAt: new Date(result.createdAt),
            updatedAt: new Date(result.updatedAt)
        })
    }

    loadingState.value = false
    openCreateInitialNote.value = false
}

</script>