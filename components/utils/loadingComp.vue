<template>
    <template v-if="!loadingState">
        <slot />
    </template>
    <template v-else>
        <UButton color="neutral" loading>
            Loading
        </UButton>
    </template>
</template>
<script setup lang="ts">
defineProps(['loadingState'])
</script>