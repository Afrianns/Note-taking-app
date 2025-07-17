<template>
    <UApp>
        <NuxtLayout name="home">
            <div class="flex">
                <div class="p-5 pl-5 w-full max-w-[18rem] mt-18">
                    <UModal v-model:open="open" title="Create New Note" description="Get starter with your note."
                        :ui="{ footer: 'justify-end' }">
                        <UButton class="w-full text-center block">+ New Note</UButton>
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
                    <div class="my-5">
                        <template v-if="storage.notes.length > 0" v-for="(note, idx) in storage.notes" :key="idx">
                            <USeparator class="my-3" />
                            <nuxt-link :to="'/dashboard/' + idx + '_' + note.id"
                                class="p-3 rounded-md  space-y-2 cursor-pointer block"
                                :class="{ 'bg-main-300 dark:bg-main-950': `${idx}_${note.id}` == $route.params.id }">
                                <h2 class="font-bold text-xl">{{ note.title }}</h2>
                                <div class="flex gap-x-2">
                                    <span
                                        class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">dev</span>
                                    <span
                                        class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">daily</span>
                                </div>
                                <span class="text-muted text-xs font-medium">{{ useConvertDate(note.createdAt) }}</span>
                            </nuxt-link>
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
                <USeparator orientation="vertical" class="h-screen" />
                <div class="p-5 flex gap-x-16 justify-left text-left mx-auto max-w-[1000px] w-full mt-18">
                    <slot />
                </div>
                <USeparator orientation="vertical" class="h-screen" v-show="$route.name == 'dashboard-id'" />
                <div class="mt-18 p-5 space-y-3 w-full max-w-[200px]" v-show="$route.name == 'dashboard-id'">
                    <UButton icon="material-symbols:archive-outline" color="neutral" variant="outline" size="lg" block
                        :ui="{ base: 'w-full' }">
                        Archived Note</UButton>
                    <UButton icon="tabler:trash" color="neutral" variant="outline" size="lg" class="text-center" block
                        :ui="{ base: 'w-full' }">
                        Delete Note</UButton>
                </div>
            </div>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

import { useSessionStore } from '~/store/storage';
const toast = useToast()

const storage = useSessionStore();

const open = ref(false)
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
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)

    if (event.data.title) {
        createInitialNote(event.data.title);
    }
}

const createInitialNote = async (title: string) => {

    const result = await $fetch("/api/initialNote", {
        method: "POST",
        body: {
            userId: storage.credential.id,
            title: title,
        }
    })
    console.log(result)
}

</script>