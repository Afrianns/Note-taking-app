<template>
    <NuxtLayout name="notes-note">
        <UForm :state="state" class="w-full flex flex-col justify-between" @submit="onSubmit">
            <section>
                <UInput v-if="storage.notes.length > 0" class="text-4xl font-bold w-full" size="xl"
                    :ui="{ base: 'p-0 ring-0 focus-visible:ring-0 text-3xl' }" v-model="state.title" />
                <USkeleton v-else class="h-10 w-full max-w-[20rem]" />
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
                            string)?.createdAt)
                        }}</p>
                        <USkeleton v-else class="h-5 w-28" />
                    </section>
                </div>
                <USeparator />
                <UTextarea :rows="12" v-model="state.content" class="w-full py-5" :highlight="false" :autoresize="true"
                    :ui="{ base: 'ring-0 focus-visible:ring-0' }" />
            </section>
            <section>
                <USeparator />
                <div class="flex justify-start gap-x-5 items-center mt-5">
                    <UButton label="Save" type="submit" />
                    <UButton label="Cancel" color="neutral" type="submit" variant="soft" />
                </div>
            </section>
        </UForm>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useSessionStore } from '~/store/storage';

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
    content: ""
})

console.log(storage.notes.length)

watch(() => state.content,
    (data) => {
        console.log(data)
    })

watch(() => storage.notes, () => {
    state.title = getValue()?.title
})


async function onSubmit(event: FormSubmitEvent<typeof state>) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
}

</script>