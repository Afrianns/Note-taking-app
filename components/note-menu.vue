<template>
    <ul class="my-5 flex flex-col gap-y-3">
        <li>
            <nuxt-link to="/dashboard" class="flex justify-between items-center py-2 px-3 rounded-md cursor-pointer"
                :class="{
                    'bg-main-300 dark:bg-main-950 ': $route.name == 'dashboard' || $route.name == 'dashboard-id'
                }">
                <div class="flex items-center gap-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M3 6v16h18v2H3a2 2 0 0 1-2-2V6zm13 3h5.5L16 3.5zM7 2h10l6 6v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 2v14h14v-7h-7V4z" />
                    </svg>
                    <p>All Notes</p>
                </div>
                <svg v-show="$route.name == 'dashboard' || $route.name == 'dashboard-id'"
                    xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 12 24">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                </svg>
            </nuxt-link>
        </li>
        <li>
            <nuxt-link to="/archived" class="flex justify-between items-center py-2 px-3 rounded-md cursor-pointer"
                :class="{
                    'bg-main-300 dark:bg-main-950': $route.name == 'archived' || $route.name == 'archived-id'
                }">
                <div class="flex items-center gap-x-3 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 10q-.425 0-.712.288T11 11v3.2l-.9-.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.6 2.6q.3.3.7.3t.7-.3l2.6-2.6q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-.9.9V11q0-.425-.288-.712T12 10M5 8v11h14V8zm0 13q-.825 0-1.412-.587T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675V19q0 .825-.587 1.413T19 21zm.4-15h13.2l-.85-1H6.25zm6.6 7.5" />
                    </svg>
                    <p>Archived Notes</p>
                </div>
                <svg v-show="$route.name == 'archived' || $route.name == 'archived-id'"
                    xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 12 24">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414" />
                </svg>
            </nuxt-link>
        </li>
    </ul>
</template>