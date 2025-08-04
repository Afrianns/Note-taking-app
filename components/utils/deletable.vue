<template>
    <UModal v-model:open="openConfirmationDelete" title="Delete Note" description="Confirmation Delete Note"
        :ui="{ footer: 'justify-end' }">

        <UButton icon="tabler:trash" color="neutral" variant="outline" size="lg" block :ui="{ base: 'w-full' }">
            Delete Note</UButton>
        <template #body>
            <h1>ARE YOU SURE WANT TO DELETE THIS NOTE?</h1>
        </template>

        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />

            <utilsLoading :loadingState="loadingState" color="neutral">
                <UButton label="Delete" color="neutral"
                    @click="doDeleteNote($route.params.id as string, $route.name as string)" />
            </utilsLoading>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import { useSessionStore } from '~/store/storage'
import { deleteNote } from '~/lib/fetch';
import { toast as vueToast } from 'vue-sonner';

const openConfirmationDelete = ref(false)
const loadingState = ref(false)

const storage = useSessionStore()

const doDeleteNote = async (id: string, routeName: string) => {
    loadingState.value = true
    const result = await deleteNote(id)

    if (result) {
        if (routeName == 'dashboard-id') {
            storage.removeNoteById(id)
        } else {
            storage.removeArchivedNoteById(id)
        }

        navigateTo(`/${routeName.split('-')[0]}`)

        vueToast.success("Successfully deleted", {
            description: 'The note has been deleted.',
        });
    }
    loadingState.value = false
    openConfirmationDelete.value = false;
}
</script>
