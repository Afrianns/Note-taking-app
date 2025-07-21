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
            <UtilsLoadingComp :loadingState="loadingArchivableState">
                <UButton label="Confirm" color="neutral"
                    @click="checkTypeArchivable($route.params.id as string, name)" />
            </UtilsLoadingComp>
        </template>
    </UModal>
</template>
<script setup lang="ts">
import { useSessionStore } from '~/store/storage'
import type { noteType } from '~/types/types'

defineProps(['name'])
const openConfirmationArchived = ref(false)

const storage = useSessionStore()
const toast = useToast()

const loadingArchivableState = ref(false)


const checkTypeArchivable = (id: string, name: string) => {
    if (name.toLowerCase() == "archived") {
        archivedNote(id);
    } else {
        restoreArchivedNote(id)
    }
}

const archivedNote = async (id: string) => {
    loadingArchivableState.value = true
    const result = await $fetch("/api/note/archivedNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
            value: true
        }
    })

    let resultArrFirst = result['0' as keyof typeof result]
    if (result[1]) {
        storage.removeNoteById(id)
        storage.addArchivedNote(resultArrFirst['0' as keyof typeof resultArrFirst] as noteType)
        toast.add({ title: 'Success', description: 'The note has been archived.', color: 'success' })
        navigateTo("/dashboard")
    }
    loadingArchivableState.value = false
}

const restoreArchivedNote = async (id: string) => {
    loadingArchivableState.value = true
    const result = await $fetch("/api/note/archivedNote", {
        method: "POST",
        body: {
            noteId: id.split("_")[1],
        }
    })
    let resultArrFirst = result['0' as keyof typeof result]

    if (!result[1]) {
        storage.removeArchivedNoteById(id)
        storage.addNote(resultArrFirst['0' as keyof typeof resultArrFirst] as noteType)
        toast.add({ title: 'Success', description: 'The note has been unarchived.', color: 'success' })
        navigateTo("/archived")
    }
    loadingArchivableState.value = false
}
</script>
