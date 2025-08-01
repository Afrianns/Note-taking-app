import type { createdTagType, noteType, tagType } from "~/types/types";

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

export const upsertTag = async (tag: tagType, noteId: string) => {
  const result: noteType = await $fetch("/api/tag/upsertNoteTag", {
    method: "POST",
    body: {
      tagId: tag.id,
      noteId: noteId,
      name: tag.name,
    },
  });

  return result;
};
