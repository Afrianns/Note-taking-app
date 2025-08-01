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
                        <UInputMenu v-if="items.length && (getValue()?.tags.length >= 1 || state.title != null)"
                            create-item multiple :items="items" v-model="currentNoteTags" @create="onCreate"
                            class="w-full border-0 ring-0" :highlight="false"
                            :ui="{ base: 'ring-0 focus-visible:ring-0 border-0 has-focus-visible:ring-0 p-0' }" />
                        <div v-else class="flex gap-x-2 items-center">
                            <USkeleton class="h-5 w-14" />
                            <USkeleton class="h-5 w-14" />
                        </div>
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
                    <UButton label="Cancel" color="neutral" variant="soft" @click="resetToPrevSaved(routeId)" />
                </div>
            </section>
        </UForm>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { toast as vueToast } from 'vue-sonner'
import { useSessionStore } from '~/store/storage'
import { noteExistType, type inputTagType, type noteType, type tagType } from "~/types/types"

const routeId = computed(() => String(route.params.id))

const route = useRoute()
const toast = useToast()
const storage = useSessionStore()

const loadingState = ref(false)
const currentNoteTags = ref<inputTagType[]>([]);

const items = computed(() => storage.tags.map((tag: tagType) => ({ value: tag.id, label: tag.name })))

type createdTagType = [tagType[], string]

const onCreate = async (item: string) => {

    const result: createdTagType = await $fetch("/api/tag/createTag", {
        method: "POST",
        body: {
            nameTag: item
        }
    })

    if (result[0] && !result[1]) {
        // items.value.push(item)
        storage.tags.push(result[0][0])
        currentNoteTags.value = [...currentNoteTags.value, { value: result[0][0].id, label: result[0][0].name }]
        // upsertNoteTag(result[0][0] as unknown as tagType)
        //     storage.tags.push(result[0][0] as unknown as tagType);
        vueToast.success("Success to create tag", {
            description: "Tag successfuly added.",
        });
    }
    if (!result[0] && result[1]) {
        vueToast.error("Failed to create tag", {
            description: result[1] as string,
        });
    }
}

const getValueBaseOnId = (uuid: string) => {
    const id = uuid.split("_")[0]
    return storage.notes[id as unknown as number]
}

const getValue = () => getValueBaseOnId(route.params.id as string)
const noteId = () => (route.params.id as string).split("_")[0] as unknown as number;

currentNoteTags.value = getValue()?.tags.map((tag) => ({ value: tag.id, label: tag.name }));

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

watch(() => currentNoteTags.value, (newData: inputTagType[], oldData: inputTagType[]) => {

    if (storage.firstTimeload) {
        storage.firstTimeload = false;
        return;
    }

    let deletedValue = checkDeletedOrAdded(oldData, newData);// check if deleted
    let addedValue = checkDeletedOrAdded(newData, oldData); // check if added

    console.log(deletedValue, addedValue)

    //     console.log(deletedValue, addedValue)

    if (addedValue) {
        storage.notes[noteId()].tags.push({
            id: addedValue.value,
            name: addedValue.label
        })
    }
    if (deletedValue) {
        storage.notes[noteId()].tags = storage.notes[noteId()].tags.filter((tag) => tag.name != deletedValue.label);
    }
})


// watch for content, title, and tags
watch(() => state.content, (data: string | null) => storage.notes[noteId()].content = data)
watch(() => state.title, (data: string | null) => storage.notes[noteId()].title = data)

// load first time since data async
watch(() => storage.notes, () => {
    getNote()
    // getNoteTags()
})

const getNote = () => {

    currentNoteTags.value = getValue()?.tags.map((tag) => ({ value: tag.id, label: tag.name }));

    state.title = getValue()?.title
    state.content = getValue()?.content
    state.updatedAt = getValue()?.updatedAt

}

// const getNoteTags = () => {
//     getValue()?.tags.forEach((tag: { id: string, name: string }) => {
//         tags.name.push(tag.name as string)
//         tags.id.push(tag.id as string)
//     })
// }

interface NoteType {
    id: string;
    title: string;
    content: string;
}

type completeNoteType = [NoteType[], string]

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    loadingState.value = true

    vueToast.info("Note successfully Updated", {
        description: `Your note title: ${event.data.title} updated`,
    });
    // toast.add({ title: 'Success', description: `Note successfuly Updated. ${event.data} and ${currentNoteTags.value}`, color: 'success' })

    console.log(event.data, currentNoteTags.value);
    // const result: completeNoteType = await $fetch("/api/note/updateCompletedNote", {
    //     method: "POST",
    //     body: {
    //         id: storage.notes[noteId()].id,
    //         title: event.data.title,
    //         content: event.data.content
    //     }
    // })

    // if (result[0] && !result[1]) {
    //     toast.add({ title: 'Success', description: 'Successfuly updated.', color: 'success' })
    // }

    // if (!result[0] && result[1]) {
    //     resetToPrevSaved(route.params.id as string)
    //     toast.add({ title: 'Failed', description: result[1] as string, color: 'error' })
    // }
    loadingState.value = false
}

const upsertNoteTag = async (tag: tagType) => {
    const result: noteType = await $fetch("/api/tag/upsertNoteTag", {
        method: "POST",
        body: {
            tagId: tag.id,
            noteId: getValue().id,
            name: tag.name,
        }
    })

    // if (result) {
    //     storage.notes[noteId()].tags.push({
    //         id: result[0].tagId,
    //         name: result[0].name
    //     })
    //     console.log(result[0])
    // }

}

const resetToPrevSaved = async (id: string) => {

    const result: noteType = await $fetch("/api/note/getSingleNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })

    console.log(result)
    if (result) {
        storage.notes[noteId()] = result as unknown as noteType
        state.title = result.title
        state.content = result.content

        currentNoteTags.value = getValue()?.tags.map((tag) => ({ value: tag.id, label: tag.name }));

    }
}
</script>