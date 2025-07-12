<template>
    <NuxtLayout name="notes-note">
        <span v-on:click="saveTag()">click me</span>
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
    // const result = await $fetch("/api/crud", {
    //     method: "POST",
    //     body: {
    //         name: "jackson",
    //     }
    // });
    // console.log(result)
}
</script>