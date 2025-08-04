<template>
    <NuxtLayout name="settings-setting">
        <UForm :state="stateChangeInfo" class="flex flex-col gap-x-4">
            <div class="flex max-lg:flex-col gap-x-4 my-3">
                <div class="w-full lg:w-[25rem] space-y-3">
                    <p class="text-muted mb-4 font-bold text-lg">
                        Update Account Information
                    </p>
                    <UFormField label="Name" name="name">
                        <UInput v-model="stateChangeInfo.name" class="w-full" />
                    </UFormField>
                    <UFormField label="Email" name="email">
                        <UInput v-model="stateChangeInfo.email" class="w-full" required />
                    </UFormField>
                    <div class="flex gap-x-1 items-center bg-orange-500 text-gray-200 py-2 px-3 rounded-md"
                        v-if="user.credential && user.credential.emailVerified">
                        <svg xmlns=" http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 56 56">
                            <path fill="currentColor"
                                d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m-.023-15.68c1.124 0 1.757-.633 1.78-1.851l.352-12.375c.024-1.196-.914-2.086-2.156-2.086c-1.266 0-2.156.867-2.133 2.062l.305 12.399c.023 1.195.68 1.851 1.852 1.851m0 7.617c1.335 0 2.53-1.078 2.53-2.437c0-1.383-1.171-2.438-2.53-2.438c-1.383 0-2.532 1.078-2.532 2.438c0 1.336 1.172 2.437 2.532 2.437" />
                        </svg>
                        <span class="text-xs">You will need
                            to check your old
                            email for confirmation, otherwise email will not update</span>
                    </div>
                </div>
                <div class="mt-10 lg:mt-auto mx-auto">
                    <UButton v-if="!isUpdateUserInfoMessage" label="Save" type="submit" variant="soft" class="px-10"
                        @click="updateUserInfo()" size="xl" />
                    <UButton v-else label="Save" type="submit" variant="soft" class="px-10" loading size="xl" />
                </div>
            </div>
        </UForm>
        <USeparator class="my-3" />
        <UForm :state="stateChangePassword" class="flex flex-col gap-x-4">
            <div class="flex max-lg:flex-col gap-x-4 my-3">
                <div class="w-full lg:w-[25rem] space-y-3">
                    <p class="text-muted mb-4 font-bold text-lg">
                        Update Password
                    </p>
                    <UFormField label="Old Password" name="confirm">
                        <UInput v-model="stateChangePassword.oldPassword" placeholder="Password"
                            :type="show ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }" required class="w-full">
                            <template #trailing>
                                <UButton color="neutral" variant="link" size="sm"
                                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                    :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show"
                                    aria-controls="password" @click="show = !show" />
                            </template>
                        </UInput>
                    </UFormField>
                    <input-account :stateAcc="stateChangePassword" @password-score="(score) => passwordScore = score" />
                </div>
                <div class="mt-10 lg:mt-auto mx-auto">
                    <UButton label="Save" type="submit" variant="soft" class="px-10" @click="updateUserPassword()"
                        size="xl" />
                </div>
            </div>
        </UForm>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { changeEmail, updateUser, changePassword } from '~/lib/auth-client'
import { useSessionStore } from '~/store/storage';

const user = useSessionStore();

const toast = useToast()

const show = ref(false)

const passwordScore = ref(0)

const isUpdateUserInfoMessage = ref(false)

const stateChangeInfo = reactive({
    name: user.credential.name,
    email: user.credential.email
})


watch(() => user.credential, () => {
    stateChangeInfo.name = user.credential.name
    stateChangeInfo.email = user.credential.email
})

const stateChangePassword = reactive({
    oldPassword: '',
    password: '',
    confirmPassword: ''
})

const updateUserInfo = async () => {

    if (user.credential) {
        isUpdateUserInfoMessage.value = true;
        if (stateChangeInfo.name.trim() != "" && stateChangeInfo.name != user.credential.name) {
            const result = await updateUser({
                name: stateChangeInfo.name,
            })

            if (result.data && result.data.status) {
                toastMessage('Name Successfully Updated.');
                user.getUserCredential();
            } else {
                return toastMessage('Uh oh! Something went wrong.', 'material-symbols-light:info-outline');
            }
        }

        if (stateChangeInfo.email.trim() != "" && stateChangeInfo.email != user.credential.email) {
            const result = await changeEmail({
                newEmail: stateChangeInfo.email,
                callbackURL: "/dashboard",
            });

            if (result.data && result.data.status) {
                if (user.credential.emailVerified) {
                    toastMessage('Verification Successfully Sent.');
                } else {
                    toastMessage('Email Successfully Updated.');
                    user.getUserCredential();
                }
            } else {
                return toastMessage('Uh oh! Something went wrong.', 'material-symbols-light:info-outline');
            }
        }
    } else {
        return toastMessage('Uh oh! Something went wrong.', 'material-symbols-light:info-outline');
    }

    isUpdateUserInfoMessage.value = false;
}

const updateUserPassword = async () => {
    console.log(stateChangePassword, passwordScore.value)
    if (passwordScore.value < 4) {
        return toastMessage("Password too Weak.", 'material-symbols-light:info-outline');
    }

    if (stateChangePassword.password !== stateChangePassword.confirmPassword) {
        return toastMessage("Password and confirmation password didn't match.", 'material-symbols-light:info-outline');
    }

    const result = await changePassword({
        newPassword: stateChangePassword.password,
        currentPassword: stateChangePassword.oldPassword,
        revokeOtherSessions: true,
    });

    console.log(result)
    if (result.data && result.data.user) {
        return toastMessage('Verification Successfully Sent.');
    }
    if (result.error) {
        return toastMessage(result.error.message);
    }
}
const toastMessage = (title: string = "There is an something occur.", icon: string = 'qlementine-icons:success-12') => {
    toast.add({
        title: title,
        icon: icon,
        color: "primary"
    })
}

</script>