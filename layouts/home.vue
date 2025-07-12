<template>
    <div class="flex">
        <div class="w-64 fixed flex">
            <div class="w-full p-5">
                <h1 class=" font-Manu-Consent text-2xl font-bold text-gray-800 dark:text-gray-200 underline">The Notes
                    Inc
                </h1>
                <NoteMenu />
                <USeparator class="w-full bg-red-300" />

                <h3 class="my-2 text-gray-500">Tags</h3>
            </div>
            <USeparator orientation="vertical" class="h-svh" />
        </div>
        <div class="pl-64 w-screen">
            <div
                class="flex justify-between py-5 items-center px-5 left-64 right-0 fixed border-b-main-200 dark:border-b-main-950 border-b bg-main-50 dark:bg-main-900">
                <h2 v-show="checkLinkName('home')" class="font-bold">All Notes</h2>
                <h2 v-show="checkLinkName('archived')" class="font-bold">All Archived Notes</h2>
                <h2 v-show="checkLinkName('setting')" class="font-bold">Settings</h2>
                <div class="flex items-center gap-x-3">
                    <UInput ref="input" icon="i-lucide-search" placeholder="Search...">
                        <template #trailing>
                            <UKbd value="/" />
                        </template>
                    </UInput>
                    <nuxt-link to="/setting" class="p-1  rounded-md" :class="{
                        ' bg-main-300 dark:bg-main-950': checkLinkName('setting')
                    }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M14.208 4.83q.68.21 1.3.54l1.833-1.1a1 1 0 0 1 1.221.15l1.018 1.018a1 1 0 0 1 .15 1.221l-1.1 1.833q.33.62.54 1.3l2.073.519a1 1 0 0 1 .757.97v1.438a1 1 0 0 1-.757.97l-2.073.519q-.21.68-.54 1.3l1.1 1.833a1 1 0 0 1-.15 1.221l-1.018 1.018a1 1 0 0 1-1.221.15l-1.833-1.1q-.62.33-1.3.54l-.519 2.073a1 1 0 0 1-.97.757h-1.438a1 1 0 0 1-.97-.757l-.519-2.073a7.5 7.5 0 0 1-1.3-.54l-1.833 1.1a1 1 0 0 1-1.221-.15L4.42 18.562a1 1 0 0 1-.15-1.221l1.1-1.833a7.5 7.5 0 0 1-.54-1.3l-2.073-.519A1 1 0 0 1 2 12.72v-1.438a1 1 0 0 1 .757-.97l2.073-.519q.21-.68.54-1.3L4.27 6.66a1 1 0 0 1 .15-1.221L5.438 4.42a1 1 0 0 1 1.221-.15l1.833 1.1q.62-.33 1.3-.54l.519-2.073A1 1 0 0 1 11.28 2h1.438a1 1 0 0 1 .97.757zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
                        </svg>
                    </nuxt-link>
                </div>
            </div>

            <!-- <div class="pt-18"> -->
            <slot />
            <!-- </div> -->
        </div>
    </div>
</template>
<script setup lang="ts">
const input = useTemplateRef('input')

defineShortcuts({
    '/': () => {
        input.value?.inputRef?.focus()
    }
})

const checkLinkName = (name: string) => (useRoute().name as string)?.split('-')[0] == name

</script>