<template>
    <NuxtLayout name="home">
        <div class="flex">
            <div class="p-5 pl-5 w-full max-w-[20rem] mt-18">
                <UButton class="w-full text-center block">+ New Note</UButton>
                <h3>The Long List</h3>
            </div>
            <USeparator orientation="vertical" class="h-[calc(100vh-73px)]" />
            <div class="p-5 flex gap-x-16 justify-left text-left mx-auto max-w-[900px] w-full  mt-18">
                <slot />
            </div>
        </div>
    </NuxtLayout>
</template>