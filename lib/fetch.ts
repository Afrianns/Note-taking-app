import type {
  createdTagType,
  inputTagType,
  noteTagType,
  noteType,
  tagType,
} from "~/types/types";

export const getSingleNote = async (id: string) => {
  const result: noteType = await $fetch("/api/note/getSingleNote", {
    method: "POST",
    body: {
      noteId: id.split("_")[1],
    },
  });

  return result;
};

export const createTag = async (item: string) => {
  const result: createdTagType = await $fetch("/api/tag/createTag", {
    method: "POST",
    body: {
      nameTag: item,
    },
  });

  return result;
};

export const insertInitialNote = async (title: string, userId: string) => {
  const result = await $fetch("/api/note/createInitialNote", {
    method: "POST",
    body: {
      userId: userId,
      title: title,
    },
  });
  return result;
};

export const insertNote = async (
  inputData: { title: string | null; content: string | null; updatedAt: Date },
  noteId: string
) => {
  const result = await $fetch("/api/note/updateCompletedNote", {
    method: "POST",
    body: {
      id: noteId,
      title: inputData.title,
      content: inputData.content,
    },
  });

  return result;
};

export const upsertTag = async (tags: inputTagType[], noteId: string) => {
  const result: noteType = await $fetch("/api/tag/upsertNoteTag", {
    method: "POST",
    body: { tags: tags, noteId: noteId },
  });

  return result;
};

export const archivingNote = async (noteId: string, archiving: boolean) => {
  const result = await $fetch("/api/note/archivedNote", {
    method: "POST",
    body: {
      noteId: noteId,
      setArchiving: archiving,
    },
  });

  return result;
};

export const deleteNote = async (noteId: string) => {
  const result = await $fetch("/api/note/deleteNote", {
    method: "POST",
    body: {
      noteId: noteId,
    },
  });

  return result;
};

export const deleteTag = async (tagId: string) => {
  const result = await $fetch("/api/tag/deleteTag", {
    method: "POST",
    body: {
      tagId: tagId,
    },
  });

  return result;
};
