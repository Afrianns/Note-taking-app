<template>
    <NuxtLayout name="notes-note">
        <div class="w-full flex flex-col justify-between">
            <section>
                <h1 v-if="state" class="text-4xl font-bold w-full">{{ state.title }}</h1>
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
                        <p v-if="state">{{ useConvertDate(state.updatedAt) }}</p>
                        <USkeleton v-else class="h-5 w-28" />
                    </section>
                </div>
                <USeparator />
                <p v-if="state" class="w-full py-5">{{ state.content }}</p>
                <div v-else class="space-y-2 mt-2">
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-full" />
                    <USkeleton class="h-5 w-1/2" />
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { useSessionStore } from '~/store/storage'
import { notesArchivedExistType } from "~/types/types"
const route = useRoute()

const storage = useSessionStore();

const getValueBaseOnId = (uuid: string) => {
    const id = uuid.split("_")[0];
    return storage.archivedNotes[id as unknown as number]
}

const getValue = () => getValueBaseOnId(route.params.id as string)

const state = reactive({
    title: getValue()?.title,
    content: getValue()?.content,
    updatedAt: getValue()?.updatedAt
})

watch(() => storage.notesArchivedExist, (data) => {

    if (storage.notesArchivedExist == notesArchivedExistType.NOTEXIST) {
        navigateTo("/archived")
    }
})

// const noteId = () => (route.params.id as string).split("_")[0] as unknown as number;


// load first time since data async
watch(() => storage.archivedNotes, () => {
    state.title = getValue()?.title
    state.content = getValue()?.content
    state.updatedAt = getValue()?.updatedAt
})

</script>