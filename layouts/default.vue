<template>
    <Toaster richColors />
    <slot />
</template>
<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

</script>