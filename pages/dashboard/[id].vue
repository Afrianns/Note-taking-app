<template>
    <NuxtLayout name="notes-note">
        <UForm :state="state" class="w-full flex flex-col justify-between" @submit="onSubmit">
            <section>
                <UInput v-if="state.title != null" class="text-4xl font-bold w-full" size="xl"
                    :ui="{ base: 'p-0 ring-0 focus-visible:ring-0 text-3xl' }" v-model="state.title" />
                <USkeleton v-else class="h-9 w-full max-w-[20rem]" />
                <div class="my-5 space-y-3">
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-32 text-muted">
                            <UIcon name="mdi:tag-outline" :size="25" />
                            <p>Tags</p>
                        </div>
                        <UInputMenu v-model="tags.name" create-item multiple :items="items" @create="onCreate"
                            class="w-full border-0 ring-0" :highlight="false"
                            :ui="{ base: 'ring-0 focus-visible:ring-0 border-0 has-focus-visible:ring-0 p-0' }" />
                    </section>
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-20  text-muted">
                            <UIcon name="mingcute:time-line" :size="25" />
                            <p>Last Edited</p>
                        </div>
                        <p v-if="state.updatedAt != null">{{ useConvertDate(state.updatedAt) }}</p>
                        <USkeleton v-else class="h-5 w-28" />
                    </section>
                </div>
                <USeparator />
                <UTextarea v-if="state.content != null" :rows="12" v-model="state.content" class="w-full py-5"
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
                    <UtilsLoadingComp :loadingState="loadingState" color="primary">
                        <UButton label="Save" type="submit" />
                    </UtilsLoadingComp>
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
import { noteExistType, type noteType, type tagType, type noteTagType } from "~/types/types"

const tags = reactive({
    name: ['daily', 'dev'],
    id: []
})
const items = computed(() => storage.tags.map((tag) => tag.name))

const route = useRoute()
const toast = useToast()
const storage = useSessionStore()

const loadingState = ref(false)

const onCreate = async (item: string) => {
    const result = await $fetch("/api/tag/createTag", {
        method: "POST",
        body: {
            nameTag: item
        }
    })

    if (result[0] && !result[1]) {
        items.value.push(item)
        tags.name.push(item)
        upsertNoteTag(result[0][0] as unknown as tagType)
        storage.tags.push(result[0][0] as unknown as tagType);
        toast.add({ title: 'Success', description: 'Tag successfuly added.', color: 'success' })
    }
    if (!result[0] && result[1]) {
        toast.add({ title: 'Failed', description: result[1] as string, color: 'error' })
    }
}


const getValueBaseOnId = (uuid: string) => {
    const id = uuid.split("_")[0]
    return storage.notes[id as unknown as number]
}

const getValue = () => getValueBaseOnId(route.params.id as string)

const state = reactive({
    title: getValue()?.title,
    content: getValue()?.content,
    updatedAt: getValue()?.updatedAt
})

watch(() => storage.notesExist, () => {

    if (storage.notesExist == noteExistType.NOTEXIST) {
        navigateTo('/dashboard');
    }
})

const noteId = () => (route.params.id as string).split("_")[0] as unknown as number;

// watch for content, title, and tags
watch(() => state.content, (data) => storage.notes[noteId()].content = data)
watch(() => state.title, (data) => storage.notes[noteId()].title = data)

// load first time since data async
watch(() => storage.notes, () => {
    state.title = getValue()?.title
    state.content = getValue()?.content
    state.updatedAt = getValue()?.updatedAt
})


async function onSubmit(event: FormSubmitEvent<typeof state>) {
    loadingState.value = true
    const result = await $fetch("/api/note/updateCompletedNote", {
        method: "POST",
        body: {
            id: storage.notes[noteId()].id,
            title: event.data.title,
            content: event.data.content
        }
    })

    if (result[0] && !result[1]) {
        toast.add({ title: 'Success', description: 'Successfuly updated.', color: 'success' })
    }

    if (!result[0] && result[1]) {
        resetToPrevSaved(route.params.id as string)
        toast.add({ title: 'Failed', description: result[1] as string, color: 'error' })
    }
    loadingState.value = false
}

const upsertNoteTag = async (tag: tagType) => {
    const result = await $fetch("/api/tag/upsertNoteTag", {
        method: "POST",
        body: {
            tagId: tag.id,
            noteId: getValue().id,
            name: tag.name,
        }
    })

    if (result[0]) {
        storage.notes[noteId()].tags.push({
            id: result[0].tagId,
            name: result[0].name
        })
        console.log(result[0])
    }

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
    }
}
</script>