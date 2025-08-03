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
                        <UInputMenu
                            v-if="items.length > 0 && (getValue()?.tags.length >= 1 || state.title != null) || items.length <= 0 && getValue()?.tags.length <= 0"
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
                        <p v-if="state.updatedAt != null">{{ convertDate(state.updatedAt) }}</p>
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
import { toast as vueToast } from 'vue-sonner'
import { createTag, getSingleNote, insertNote, upsertTag } from '~/lib/fetch'
import { useSessionStore } from '~/store/storage'
import { noteExistType, type inputTagType, type noteTagType, type noteType, type tagType } from "~/types/types"

const route = useRoute()
const storage = useSessionStore()

const loadingState = ref(false)
const currentNoteTags = ref<inputTagType[]>([]);

const items = computed(() => storage.tags.map((tag: tagType) => ({ value: tag.id, label: tag.name })))

const getValue = () => {
    // const id = (route.params.id as string).split("_")[0]

    let result = storage.notes.find((note) => note.id == (route.params.id as string));
    // console.log(storage.notes[id as unknown as number], storage.notes.find((note) => note.id == (route.params.id as string).split("_")[1]))

    return result as noteType;
}

const onCreate = async (item: string) => {

    const result = await createTag(item)

    if (result[0] && !result[1]) {
        storage.tags.push(result[0][0])
        currentNoteTags.value = [...currentNoteTags.value, { value: result[0][0].id, label: result[0][0].name }]

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
if (getValue()?.tags) currentNoteTags.value = getValue()?.tags.map((tag: noteTagType) => ({ value: tag.id, label: tag.name }));

const state = reactive({
    title: getValue()?.title,
    content: getValue()?.content,
    updatedAt: getValue()?.updatedAt
})

watch(() => storage.notesExist, () => {
    if (storage.notesExist == noteExistType.NOTEXIST) navigateTo('/dashboard');
})

watch(() => currentNoteTags.value, (newData: inputTagType[], oldData: inputTagType[]) => {

    if (storage.firstTimeload) {
        storage.firstTimeload = false;
        return;
    }

    let deletedValue = checkDeletedOrAdded(oldData, newData);// check if deleted
    let addedValue = checkDeletedOrAdded(newData, oldData); // check if added

    if (addedValue) {
        getValue().tags.push({
            id: addedValue.value,
            name: addedValue.label
        })
    }
    if (deletedValue) {
        getValue().tags = getValue().tags.filter((tag: noteTagType) => tag.name != deletedValue.label);
    }
})

// watch for content, title, and tags
watch(() => state.content, (data: string | null) => getValue().content = data)
watch(() => state.title, (data: string | null) => getValue().title = data)

// load first time since data async
watch(() => storage.notes, () => getNote())

const getNote = () => {
    state.title = getValue()?.title
    state.content = getValue()?.content
    state.updatedAt = getValue()?.updatedAt

    currentNoteTags.value = getValue()?.tags.map((tag: noteTagType) => ({ value: tag.id, label: tag.name }));
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    loadingState.value = true
    const result = await insertNote(event.data, getValue().id);
    upsertNoteTag(currentNoteTags.value);

    console.log(event.data, currentNoteTags.value, result);

    if (result[0] && !result[1]) {
        vueToast.info("Note successfully Updated", {
            description: `Your note title: ${event.data.title} updated`,
        });
    }

    if (!result[0] && result[1]) {
        vueToast.info("Note failed to updated", {
            description: `Field can't be empty`,
        });
    }
    loadingState.value = false
}

const upsertNoteTag = async (tag: inputTagType[]) => {

    const result = await upsertTag(tag, getValue().id)
    // if (result) {
    //     getValue().tags.push({
    //         id: result[0].tagId,
    //         name: result[0].name
    //     })
    //     console.log(result[0])
    // }
    console.log(result);

}

const resetToPrevSaved = async (id: string) => {
    const result = await getSingleNote(id);

    let indexNote = storage.notes.findIndex((note) => note.id == (route.params.id as string))

    if (result && indexNote != -1) {
        storage.notes[indexNote] = result as unknown as noteType
        getNote()
    }
}
</script>