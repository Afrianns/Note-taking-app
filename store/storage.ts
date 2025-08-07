import { getSession } from "~/lib/auth-client";
import type { RadioGroupValue } from "@nuxt/ui";
import {
  type noteType,
  type tagType,
  noteExistType,
  notesArchivedExistType,
} from "~/types/types";

type useSessionStoreType = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};

export const useSessionStore = defineStore("sessionStore", {
  state: () => ({
    themeMode: "system",
    loadedAll: 0,
    firstTimeload: true,
    credential: {
      emailVerified: true,
    } as useSessionStoreType,
    notes: [] as noteType[],
    archivedNotes: [] as noteType[],
    tags: [] as tagType[],
    notesExist: noteExistType.DEFAULT,
    notesArchivedExist: notesArchivedExistType.DEFAULT,
  }),
  actions: {
    initialThemeMode() {
      const mode = useColorMode();
      mode.preference = this.themeMode as string;
    },

    async getUserCredential() {
      const { data } = await getSession();
      this.getAllTags();

      if (data) {
        this.credential = data.user;
        this.getCurrentNoteUser(data.user.id);
        this.getArchivedNoteUser(data.user.id);
      }
    },

    async getCurrentNoteUser(userId: string) {
      const result = await $fetch("/api/note/getNote", {
        method: "POST",
        body: {
          userId: userId,
        },
      });

      if (result.length > 0) {
        this.notesExist = noteExistType.EXIST;
      } else {
        this.notesExist = noteExistType.NOTEXIST;
      }
      this.notes = result as unknown as noteType[];
      this.loadedAll++;
    },

    async getAllTags() {
      const result = await $fetch("/api/tag/getAllTags");

      this.tags = result as unknown as tagType[];
      this.loadedAll++;
    },

    async getArchivedNoteUser(userId: string) {
      const result = await $fetch("/api/note/getNote", {
        method: "POST",
        body: {
          type: "archived",
          userId: userId,
        },
      });
      if (result.length > 0) {
        this.notesArchivedExist = notesArchivedExistType.EXIST;
      } else {
        this.notesArchivedExist = notesArchivedExistType.NOTEXIST;
      }
      this.archivedNotes = result as unknown as noteType[];
      this.loadedAll++;
    },

    removeNoteById(id: string) {
      let index = this.getNoteByUUID(id);
      this.notes.splice(index, 1);

      if (this.notes.length <= 0) {
        this.notesExist = noteExistType.NOTEXIST;
      }
    },
    removeArchivedNoteById(id: string) {
      let index = this.getArchivedNoteByUUID(id);
      this.archivedNotes.splice(index, 1);

      if (this.archivedNotes.length <= 0) {
        this.notesArchivedExist = notesArchivedExistType.NOTEXIST;
      }
    },

    addNote(data: noteType) {
      this.notes.push(data);

      if (this.notes.length > 0) {
        this.notesExist = noteExistType.EXIST;
      }
    },

    addArchivedNote(data: noteType) {
      this.archivedNotes.push(data);

      if (this.archivedNotes.length > 0) {
        this.notesArchivedExist = notesArchivedExistType.EXIST;
      }
    },

    removeTagById(id: number) {
      this.tags.splice(id, 1);
    },

    getArchivedNoteByUUID(id: string) {
      const index = this.archivedNotes.findIndex(
        (note: noteType) => note.id == (id as string)
      );
      return index;
    },

    getNoteByUUID(id: string) {
      const index = this.notes.findIndex(
        (note: noteType) => note.id == (id as string)
      );
      return index;
    },
  },
});
