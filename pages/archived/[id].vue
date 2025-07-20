<template>
    <NuxtLayout name="notes-note">
        <div class="w-full flex flex-col justify-between">
            <section>
                <h1 v-if="storage.archivedNotes.length > 0" class="text-4xl font-bold w-full">{{ state.title }}</h1>
                <USkeleton v-else class="h-9 w-full max-w-[20rem]" />
                <div class="my-5 space-y-3">
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-32 text-muted">
                            <UIcon name="mdi:tag-outline" :size="25" />
                            <p>Tags</p>
                        </div>
                        <p>Daily, Heroes</p>
                    </section>
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-20  text-muted">
                            <UIcon name="mingcute:time-line" :size="25" />
                            <p>Last Edited</p>
                        </div>
                        <p v-if="storage.archivedNotes.length > 0">{{ useConvertDate(getValueBaseOnId(route.params.id as
                            string)?.updatedAt)
                        }}</p>
                        <USkeleton v-else class="h-5 w-28" />
                    </section>
                </div>
                <USeparator />
                <p v-if="storage.archivedNotes.length > 0" class="w-full py-5">{{ state.content }}</p>
                <div v-else class="space-y-2 mt-2">
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-1/2" />
                </div>
            </section>
            <section>
                <USeparator />
                <div class="flex justify-start gap-x-5 items-center mt-5">
                    <UModal v-model:open="openConfirmationUnarchived" title="Unarchived Note"
                        description="Confirmation Unarchived Note" :ui="{ footer: 'justify-end' }">

                        <UButton label="Unarchived Note" />
                        <template #body>
                            <h1>ARE YOU SURE WANT TO DELETE THIS NOTE?</h1>
                        </template>

                        <template #footer="{ close }">
                            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
                            <UButton label="Confirm" color="neutral"
                                @click="restoreArchivedNote($route.params.id as string)" />
                        </template>
                    </UModal>
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { useSessionStore } from '~/store/storage'
import { notesArchivedExistType, type noteType } from "~/types/types"

const route = useRoute()

const storage = useSessionStore();

const toast = useToast()

const openConfirmationUnarchived = ref(false)

const getValueBaseOnId = (uuid: string) => {
    const id = uuid.split("_")[0];
    return storage.archivedNotes[id as unknown as number]
}

const getValue = () => getValueBaseOnId(route.params.id as string)

const state = reactive({
    title: getValue()?.title,
    tags: "",
    content: getValue()?.content
})

watch(() => storage.notesArchivedExist, (data) => {

    if (storage.notesArchivedExist == notesArchivedExistType.NOTEXIST) {
        navigateTo('/dashboard');
    }
})

const noteId = () => (route.params.id as string).split("_")[0] as unknown as number;


// load first time since data async
watch(() => storage.archivedNotes, () => {
    state.title = getValue()?.title
    state.content = getValue()?.content
})


const restoreArchivedNote = async (id: string) => {

    const result = await $fetch("/api/note/archivedNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })

    if (!result[1]) {
        storage.archivedNotes.splice(id.split("_")[0] as unknown as number, 1);
        navigateTo("/archived")
        toast.add({ title: 'Success', description: 'The note has been unarchived.', color: 'success' })
    }
}
</script>