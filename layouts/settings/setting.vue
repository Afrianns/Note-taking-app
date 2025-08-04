<template>
    <NuxtLayout name="home">
        <div class="flex max-lg:flex-col h-full">
            <div class="p-5 pl-5 w-full lg:max-w-[18rem] mt-18">
                <ul class="flex lg:flex-col gap-y-3 max-lg:gap-x-3">
                    <li>
                        <nuxt-link to="/setting"
                            class="flex justify-between items-center py-2 px-3 rounded-md cursor-pointer" :class="{
                                'bg-main-300 dark:bg-main-950 ': $route.name == 'setting'
                            }">
                            <div class="flex items-center gap-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 11v10m15-8v8m0-18v4m-7.5-4v10M4 3v2m7.5 14v2M2 9.5c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C2.801 8 3.034 8 3.5 8h1c.466 0 .699 0 .883.076a1 1 0 0 1 .54.541C6 8.801 6 9.034 6 9.5s0 .699-.076.883a1 1 0 0 1-.541.54C5.199 11 4.966 11 4.5 11h-1c-.466 0-.699 0-.883-.076a1 1 0 0 1-.54-.541C2 10.199 2 9.966 2 9.5m15 2c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54c.184-.077.417-.077.883-.077h1c.466 0 .699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883s0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077h-1c-.466 0-.699 0-.883-.076a1 1 0 0 1-.54-.541C17 12.199 17 11.966 17 11.5m-7.5 3c0-.466 0-.699.076-.883a1 1 0 0 1 .541-.54C10.301 13 10.534 13 11 13h1c.466 0 .699 0 .883.076a1 1 0 0 1 .54.541c.077.184.077.417.077.883s0 .699-.076.883a1 1 0 0 1-.541.54C12.699 16 12.466 16 12 16h-1c-.466 0-.699 0-.883-.076a1 1 0 0 1-.54-.541c-.077-.184-.077-.417-.077-.883"
                                        color="currentColor" />
                                </svg>
                                <p>Preferences</p>
                            </div>
                            <svg v-show="$route.name == 'setting'" class="max-lg:hidden"
                                xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 12 24">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                            </svg>
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="/setting/account"
                            class="flex justify-between items-center py-2 px-3 rounded-md cursor-pointer"
                            :class="{ 'bg-main-300 dark:bg-main-950 ': $route.name == 'setting-account' }">
                            <div class="flex items-center gap-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-2 16H7v-.24C8.42 17.62 10.16 17 12 17s3.58.62 5 1.76zm2-1.14C17.2 16.09 14.73 15 12 15s-5.2 1.09-7 2.86V5h14zM12 13c1.93 0 3.5-1.57 3.5-3.5S13.93 6 12 6S8.5 7.57 8.5 9.5S10.07 13 12 13m0-5c.83 0 1.5.67 1.5 1.5S12.83 11 12 11s-1.5-.67-1.5-1.5S11.17 8 12 8" />
                                </svg>
                                <p>Account</p>
                            </div>
                            <svg v-show="$route.name == 'setting-account'" class="max-lg:hidden"
                                xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 12 24">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                            </svg>
                        </nuxt-link>
                    </li>
                    <USeparator class="hidden lg:block" />
                    <div class="group max-lg:ml-auto">
                        <li @click="logoutFunction()"
                            class="flex justify-between items-center py-2 px-3 rounded-md cursor-pointer group-hover:bg-[#ffd8d8] group-hover:dark:bg-[#2f151e]">
                            <div class="flex items-center gap-x-3 group-hover:text-primary-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
                                </svg>
                                <p>Log out</p>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
            <USeparator orientation="vertical" class="h-full" />
            <USeparator class="lg:hidden" />
            <div class="p-5 text-left mx-auto lg:max-w-[900px] w-full lg:mt-18">
                <slot />
            </div>
        </div>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { signOut } from '~/lib/auth-client';


const logoutFunction = () => {
    signOut({
        fetchOptions: {
            onSuccess: () => {
                navigateTo("/");
            },
        },
    });
}
</script>