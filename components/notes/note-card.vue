<template>
    <USeparator class="my-3" />
    <nuxt-link :to="{ path: '/' + page + '/' + note.id, query: route.query }"
        class="p-3 rounded-md  space-y-2 cursor-pointer block"
        :class="{ 'bg-main-300 dark:bg-main-950': `${note.id}` === $route.params.id }">
        <h2 class="font-bold text-xl">{{ note.title }}</h2>
        <div class="flex gap-x-2 items-center">
            <template v-for="(tag, idx) in note.tags">
                <span v-if="idx <= 2" class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">{{
                    tag.name }}</span>
            </template>
            <span v-if="note.tags && note.tags.length > 3"
                class="py-[1px] text-xs px-2 bg-main-200 dark:bg-main-500 rounded-sm">
                {{ note.tags.length - 3 }}+
            </span>
        </div>
        <span class="text-muted text-xs font-medium">{{
            convertDate(note.createdAt)
            }}</span>
    </nuxt-link>
</template>
<script setup lang="ts">
const route = useRoute();
defineProps(['idx', 'note', 'page'])

</script>