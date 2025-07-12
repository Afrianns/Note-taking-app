<template>
    <NuxtLayout name="auth">
        <UTabs :items="items" class="md:w-1/2 mx-auto my-10">
            <template #login="{ item }">
                <UCard class="w-full dark:bg-neutral-950 bg-white">
                    <p class="text-muted mb-4 font-bold text-lg">
                        {{ item.label }}
                    </p>
                    <UForm :state="stateLogin" class="flex flex-col gap-4">
                        <UFormField label="Email" name="email">
                            <UInput v-model="stateLogin.email" class="w-full" required />
                        </UFormField>
                        <UFormField label="Password" name="confirm">
                            <UInput v-model="stateLogin.password" placeholder="Password"
                                :type="show[0] ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }" required
                                class="w-full">
                                <template #trailing>
                                    <UButton color="neutral" variant="link" size="sm"
                                        :icon="show[0] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                        :aria-label="show[0] ? 'Hide password' : 'Show password'"
                                        :aria-pressed="show[0]" aria-controls="password" @click="show[0] = !show[0]" />
                                </template>
                            </UInput>
                        </UFormField>

                        <UButton label="Login" type="submit" variant="soft" class="self-end"
                            v-on:click="sendLoginData()" />
                    </UForm>
                </UCard>
            </template>
            <template #register="{ item }">
                <UCard class="w-full dark:bg-neutral-950 bg-white">
                    <p class="text-muted mb-4 font-bold text-lg">
                        {{ item.label }}
                    </p>
                    <UForm :state="stateRegister" class="flex flex-col gap-4">
                        <UFormField label="Name" name="name">
                            <UInput v-model="stateRegister.name" class="w-full" />
                        </UFormField>
                        <UFormField label="Email" name="email" :highlight="false">
                            <UInput v-model="stateRegister.email" class="w-full" />
                        </UFormField>
                        <div class="space-y-2">
                            <UFormField label="Password">
                                <UInput v-model="stateRegister.password" name="new" placeholder="Password"
                                    :color="color" :type="show[1] ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }"
                                    :aria-invalid="score < 4" aria-describedby="password-strength" class="w-full">
                                    <template #trailing>
                                        <UButton color="neutral" variant="link" size="sm"
                                            :icon="show[1] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                            :aria-label="show[1] ? 'Hide password' : 'Show password'"
                                            :aria-pressed="show[1]" aria-controls="password"
                                            @click="show[1] = !show[1]" />
                                    </template>
                                </UInput>
                            </UFormField>

                            <UApp>
                                <UProgress :color="color" :indicator="text" :model-value="score" :max="4" size="sm" />
                            </UApp>


                            <p id="password-strength" class="text-sm font-medium">
                                {{ text }}. Must contain:
                            </p>

                            <ul class="space-y-1" aria-label="Password requirements">
                                <li v-for="(req, index) in strength" :key="index" class="flex items-center gap-0.5"
                                    :class="req.met ? 'text-success' : 'text-muted'">
                                    <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                                        class="size-4 shrink-0" />

                                    <span class="text-xs font-light">
                                        {{ req.text }}
                                        <span class="sr-only">
                                            {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <UFormField label="Confirm Password" name="confirm">
                            <UInput v-model="stateRegister.confirmPassword" placeholder="Password"
                                :type="show[2] ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }" required
                                class="w-full">
                                <template #trailing>
                                    <UButton color="neutral" variant="link" size="sm"
                                        :icon="show[2] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                        :aria-label="show[2] ? 'Hide password' : 'Show password'"
                                        :aria-pressed="show[2]" aria-controls="password" @click="show[2] = !show[2]" />
                                </template>
                            </UInput>
                        </UFormField>

                        <UButton label="Register" type="submit" variant="soft" class="self-end"
                            v-on:click="sendRegisterData()" />
                    </UForm>
                </UCard>
                {{ data }}
            </template>
        </UTabs>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { signUp, signIn } from '~/lib/auth-client';

const show = ref([false, false, false])
let data = ref()

const items = [{
    slot: 'login',
    label: 'login'
}, {
    slot: 'register',
    label: 'register'
}]

// const item = 'Create your account. Click save when you\'re done.';
// const item = "Make changes to your account here. Click save when you\'re done.";

const stateLogin = reactive({
    email: '',
    password: ''
})

const stateRegister = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

function checkStrength(str: string) {
    const requirements = [
        { regex: /.{8,}/, text: 'At least 8 characters' },
        { regex: /\d/, text: 'At least 1 number' },
        { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
        { regex: /[A-Z]/, text: 'At least 1 uppercase letter' }
    ]

    return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(stateRegister.password))
const score = computed(() => strength.value.filter(req => req.met).length)

const color = computed(() => {
    if (score.value === 0) return 'primary'
    if (score.value <= 1) return 'error'
    if (score.value <= 2) return 'warning'
    if (score.value === 3) return 'warning'
    return 'success'
})

const text = computed(() => {
    if (score.value === 0) return 'Enter a password'
    if (score.value <= 2) return 'Weak password'
    if (score.value === 3) return 'Medium password'
    return 'Strong password'
})

const sendLoginData = async () => {
    await signIn.email({
        email: stateLogin.email,
        password: stateLogin.password,
        callbackURL: "/home",
        rememberMe: false
    }, {
        onRequest: (ctx) => {
            //show loading
            console.log("loading...", ctx)
        },
        onSuccess: (ctx) => {
            console.log("success!", ctx)
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            console.log('error', ctx, ctx.error.message);
        },
    })
}

const sendRegisterData = async () => {
    await signUp.email({
        email: stateRegister.email,
        password: stateRegister.password,
        name: stateRegister.name,
        callbackURL: "/home"
    }, {
        onRequest: (ctx) => {
            //show loading
            console.log("loading...", ctx)
        },
        onSuccess: (ctx) => {
            console.log("success!", ctx)
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            console.log('error', ctx, ctx.error.message);
        },
    });
}
</script>