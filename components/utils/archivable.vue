<template>
    <UModal v-model:open="openConfirmationArchived" :title="name + ' Note'"
        :description="'Confirmation' + name + 'Note'" :ui="{ footer: 'justify-end' }">

        <UButton icon="material-symbols:archive-outline" color="neutral" variant="outline" size="lg" block
            :ui="{ base: 'w-full' }">
            {{ name }} Note</UButton>
        <template #body>
            <h1>ARE YOU SURE WANT TO {{ name.toUpperCase() }} THIS NOTE?</h1>
        </template>

        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UtilsLoadingComp :loadingState="loadingArchivableState" color="neutral">
                <UButton label="Confirm" color="neutral"
                    @click="checkTypeArchivable($route.params.id as string, name)" />
            </UtilsLoadingComp>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import { toast as vueToast } from 'vue-sonner'
import { archivingNote } from '~/lib/fetch'
import { useSessionStore } from '~/store/storage'

const openConfirmationArchived = ref(false)
const loadingArchivableState = ref(false)

const storage = useSessionStore()

defineProps(['name'])


const checkTypeArchivable = (id: string, name: string) => {
    if (name.toLowerCase() == "archived") {
        archivedNote(id);
    } else {
        restoreArchivedNote(id)
    }
}

const archivedNote = async (id: string) => {
    loadingArchivableState.value = true

    const result = await archivingNote(id.split("_")[1], true);

    if (result) {
        openConfirmationArchived.value = false
        storage.addArchivedNote(storage.notes[id.split("_")[0] as unknown as number])
        storage.removeNoteById(id)
        vueToast.success("Success to archived", {
            description: 'The note has been archived.',
        });
        navigateTo("/dashboard")
    }

    loadingArchivableState.value = false
}

const restoreArchivedNote = async (id: string) => {
    loadingArchivableState.value = true

    const result = await archivingNote(id.split("_")[1], false);

    if (result) {
        openConfirmationArchived.value = false
        storage.addNote(storage.archivedNotes[id.split("_")[0] as unknown as number])
        storage.removeArchivedNoteById(id)
        vueToast.success("Successfully to restored", {
            description: 'The note has been restored.',
        });
        navigateTo("/archived")
    }
    loadingArchivableState.value = false
}
</script>
