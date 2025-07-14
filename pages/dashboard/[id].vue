<template>
    <NuxtLayout name="notes-note">
        <div class="w-full flex flex-col justify-between">
            <section>
                <h1 class="text-3xl font-bold">Hello World {{ route.params.id }}</h1>
                <div class="my-5 space-y-3">
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-32 text-muted">
                            <UIcon name="mdi:tag-outline" :size="25" />
                            <p>Tags</p>
                        </div>
                        <p>Daily, Heroes</p>
                    </section>
                    <section class="flex items-center">
                        <div class="flex gap-x-2 items-center mr-20  text-muted">
                            <UIcon name="mingcute:time-line" :size="25" />
                            <p>Last Edited</p>
                        </div>
                        <p>20 july 2025</p>
                    </section>
                </div>
                <USeparator />
                <UTextarea :rows="12" class="w-full py-5" :highlight="false" :autoresize="true"
                    :ui="{ base: 'ring-0 focus-visible:ring-0' }" />
            </section>
            <section>
                <USeparator />
                <div class="flex justify-start gap-x-5 items-center mt-5">
                    <UButton label="Save" type="submit" />
                    <UButton label="Cancel" color="neutral" type="submit" variant="soft" />
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">

const route = useRoute()
console.log(route.params.id)
</script>