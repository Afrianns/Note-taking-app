<template>
    <template v-if="!loadingState">
        <slot />
    </template>
    <template v-else>
        <UButton :color="color" loading>
            Loading
        </UButton>
    </template>
</template>
<script setup lang="ts">
defineProps(['loadingState', 'color'])
</script>