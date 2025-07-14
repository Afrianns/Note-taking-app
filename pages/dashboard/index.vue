<template>
    <NuxtLayout name="notes-note">
        <div class="flex justify-center flex-col items-center gap-y-3 w-full text-gray-400 dark:text-main-700">
            <UIcon name="mage:note" :size="100" />
            <p>
                Pour your ideas, moments, memories into story
            </p>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { sendVerificationEmail } from '~/lib/auth-client';

const saveTag = async () => {
    let data = await sendVerificationEmail({
        email: "hanifnafrian12@gmail.com",
        callbackURL: "/",
    });

    console.log('check', data)
}

</script>