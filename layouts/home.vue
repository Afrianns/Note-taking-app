<template>
    <div v-show="false"
        class="bg-green-400 w-full py-3 text-gray-200 font-medium flex items-center justify-center gap-x-2 fixed top-0 left-0 right-0 z-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 56 56">
            <path fill="currentColor"
                d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m-.023-15.68c1.124 0 1.757-.633 1.78-1.851l.352-12.375c.024-1.196-.914-2.086-2.156-2.086c-1.266 0-2.156.867-2.133 2.062l.305 12.399c.023 1.195.68 1.851 1.852 1.851m0 7.617c1.335 0 2.53-1.078 2.53-2.437c0-1.383-1.171-2.438-2.53-2.438c-1.383 0-2.532 1.078-2.532 2.438c0 1.336 1.172 2.437 2.532 2.437" />
        </svg>
        <p>Send verification to your email by clicking <span class="underline cursor-pointer"
                @click="verifyEmail()">here</span></p>
    </div>
    <div class="flex" :class="{ ' pt-12': false }">
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
                class="flex justify-between py-5 items-center px-5 left-64 right-0 fixed border-b-main-200 dark:border-b-main-950 border-b bg-main-50 dark:bg-main-900 z-10">
                <h2 v-show="checkLinkName('dashboard')" class="font-bold">All Notes</h2>
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
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
import { sendVerificationEmail } from '~/lib/auth-client'
import { useSessionStore } from '~/store/storage';

let storage = useSessionStore();

if (!storage.credential.id) {
    storage.getUserCredential();
}

const input = useTemplateRef('input')

const toast = useToast()

defineShortcuts({
    '/': () => {
        input.value?.inputRef?.focus()
    }
})

const checkLinkName = (name: string) => (useRoute().name as string)?.split('-')[0] == name

const verifyEmail = async () => {
    if (storage.credential) {
        const result = await sendVerificationEmail({
            email: storage.credential.email,
            callbackURL: "/dashboard",
        });

        if (result.data) {
            return toast.add({
                title: 'Successfully Sent.',
                description: 'Link verification has sent to your email.',
                icon: 'qlementine-icons:success-12',
                color: "primary"
            })
        }
    }

    return toast.add({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        icon: 'material-symbols-light:info-outline',
        color: "primary"
    })
}

</script>