<template>
    <div class="pb-10 space-y-3">
        <UFormField label="Password">
            <UInput v-model="stateAcc.password" name="new" placeholder="Password" :color="color"
                :type="show[0] ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }" :aria-invalid="score < 4"
                aria-describedby="password-strength" class="w-full">
                <template #trailing>
                    <UButton color="neutral" variant="link" size="sm"
                        :icon="show[0] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="show[0] ? 'Hide password' : 'Show password'" :aria-pressed="show[0]"
                        aria-controls="password" @click="show[0] = !show[0]" />
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
                <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />

                <span class="text-xs font-light">
                    {{ req.text }}
                    <span class="sr-only">
                        {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                    </span>
                </span>
            </li>
        </ul>

        <UFormField label="Confirm Password" name="confirm">
            <UInput v-model="stateAcc.confirmPassword" placeholder="Password" :type="show ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }" required class="w-full">
                <template #trailing>
                    <UButton color="neutral" variant="link" size="sm"
                        :icon="show[1] ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        :aria-label="show[1] ? 'Hide password' : 'Show password'" :aria-pressed="show[1]"
                        aria-controls="password" @click="show[1] = !show[1]" />
                </template>
            </UInput>
        </UFormField>
    </div>
</template>
<script setup lang="ts">

const props = defineProps(['stateAcc'])

const show = ref([false, false])

function checkStrength(str: string) {
    const requirements = [
        { regex: /.{8,}/, text: 'At least 8 characters' },
        { regex: /\d/, text: 'At least 1 number' },
        { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
        { regex: /[A-Z]/, text: 'At least 1 uppercase letter' }
    ]

    return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = computed(() => checkStrength(props.stateAcc.password))
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
</script>
