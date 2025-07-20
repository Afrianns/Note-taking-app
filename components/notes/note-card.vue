<template>
    <USeparator class="my-3" />
    <nuxt-link :to="'/'+ page  +'/' + idx + '_' + note.id" class="p-3 rounded-md  space-y-2 cursor-pointer block"
        :class="{ 'bg-main-300 dark:bg-main-950': `${idx}_${note.id}` == $route.params.id }">
        <h2 class="font-bold text-xl">{{ note.title }}</h2>
        <div class="flex gap-x-2">
            <span class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">dev</span>
            <span class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">daily</span>
        </div>
        <span class="text-muted text-xs font-medium">{{
            useConvertDate(note.createdAt)
        }}</span>
    </nuxt-link>
</template>
<script setup lang="ts">

defineProps(['idx', 'note','page'])

</script>