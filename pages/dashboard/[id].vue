<template>
    <NuxtLayout name="notes-note">
        <UForm :state="state" class="w-full flex flex-col justify-between" @submit="onSubmit">
            <section>
                <UInput v-if="storage.notes.length > 0" class="text-4xl font-bold w-full" size="xl"
                    :ui="{ base: 'p-0 ring-0 focus-visible:ring-0 text-3xl' }" v-model="state.title" />
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
                        <p v-if="storage.notes.length > 0">{{ useConvertDate(getValueBaseOnId(route.params.id as
                            string)?.updatedAt)
                            }}</p>
                        <USkeleton v-else class="h-5 w-28" />
                    </section>
                </div>
                <USeparator />
                <UTextarea v-if="storage.notes.length > 0" :rows="12" v-model="state.content" class="w-full py-5"
                    :highlight="false" :autoresize="true" :ui="{ base: 'ring-0 focus-visible:ring-0' }" />
                <div v-else class="space-y-2 mt-2">
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-1/2" />
                </div>
            </section>
            <section>
                <USeparator />
                <div class="flex justify-start gap-x-5 items-center mt-5">
                    <UButton label="Save" type="submit" />
                    <UButton label="Cancel" color="neutral" variant="soft"
                        @click="resetToPrevSaved($route.params.id as string)" />
                </div>
            </section>
        </UForm>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSessionStore } from '~/store/storage'
import { noteExistType, type noteType } from "~/types/types"

const route = useRoute()

const storage = useSessionStore();

const toast = useToast()

const getValueBaseOnId = (uuid: string) => {
    const id = uuid.split("_")[0];
    return storage.notes[id as unknown as number]
}

const getValue = () => getValueBaseOnId(route.params.id as string)

const state = reactive({
    title: getValue()?.title,
    tags: "",
    content: getValue()?.content
})

watch(() => storage.notesExist, (data) => {

    if (storage.notesExist == noteExistType.NOTEXIST) {
        navigateTo('/dashboard');
    }
    console.log(storage)
})

// if (storage.notesExist == noteExistType.NOTEXIST) {
//     console.log("check")
// }

const noteId = () => (route.params.id as string).split("_")[0] as unknown as number;

// wathc for content, title, and tags
watch(() => state.content, (data) => storage.notes[noteId()].content = data)
watch(() => state.title, (data) => storage.notes[noteId()].title = data)


// load first time since data async
watch(() => storage.notes, () => {
    state.title = getValue()?.title
    state.content = getValue()?.content
})


async function onSubmit(event: FormSubmitEvent<typeof state>) {
    console.log(event.data, storage.notes[noteId()]);

    const result = await $fetch("/api/note/createCompletedNote", {
        method: "POST",
        body: {
            id: storage.notes[noteId()].id,
            title: event.data.title,
            content: event.data.content
        }
    })

    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
}

const resetToPrevSaved = async (id: string) => {

    const result = await $fetch("/api/note/getSingleNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })

    if (result) {
        storage.notes[noteId()] = result[0] as unknown as noteType
        state.title = result[0].title
        state.content = result[0].content
        console.log(result)
    }
}
</script>