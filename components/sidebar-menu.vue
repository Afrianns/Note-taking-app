<template>
    <NoteMenu />
    <USeparator class="w-full" />

    <h3 class="my-2 text-gray-500">Tags</h3>

    <div v-if="storage.tags.length > 0" v-for="(tag, idx) in storage.tags" class="space-y-5 group">
        <div
            class="flex items-center justify-between gap-x-3 group-hover:bg-gray-200 dark:group-hover:bg-main-950 py-2 px-3 cursor-pointer mt-1">
            <div class="flex items-center gap-x-2">
                <UIcon name="lucide:tag" />
                <p>{{ tag.name }}</p>
            </div>
            <TagDropdown :tagName="tag.name" @checklistFilter="(a: boolean) => checkingTagFilter(a, idx)"
                :checkFilter="tagFilterCheck[idx]" />
        </div>
    </div>
    <div v-else-if="storage.tags.length <= 0 && storage.loadedAll >= 3">
        <p class="text-center text-muted">No Tags</p>
    </div>
    <div v-else class="space-y-3 mt-5">
        <div class="flex items-center gap-x-2">
            <USkeleton class="h-5 w-1/5" />
            <USkeleton class="h-5 w-4/5" />
        </div>
        <div class="flex items-center gap-x-2">
            <USkeleton class="h-5 w-1/5" />
            <USkeleton class="h-5 w-4/5" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useSessionStore } from '~/store/storage';
let storage = useSessionStore();

const tagFilterCheck = ref<boolean[]>([]);

watch(() => storage.tags, () => {
    populateTagFilterCheck()
})

const checkingTagFilter = (param: boolean, idx: number) => {
    populateTagFilterCheck();
    tagFilterCheck.value[idx] = param
}

const populateTagFilterCheck = () => {
    let tempTagFilterCheck = [];
    for (const _ of storage.tags) {
        tempTagFilterCheck.push(false);
    }
    tagFilterCheck.value = tempTagFilterCheck
}
</script>