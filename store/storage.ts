import { getSession } from "~/lib/auth-client";
import {
  type noteType,
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
    credential: {
      emailVerified: true,
    } as useSessionStoreType,
    notes: [] as noteType[],
    archivedNotes: [] as noteType[],
    notesExist: noteExistType.DEFAULT,
    notesArchivedExist: notesArchivedExistType.DEFAULT,
  }),
  actions: {
    async getUserCredential() {
      const { data } = await getSession();
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
    },

    async getArchivedNoteUser(userId: string) {
      const result = await $fetch("/api/note/getArchivedNote", {
        method: "POST",
        body: {
          userId: userId,
        },
      });
      if (result.length > 0) {
        this.notesArchivedExist = notesArchivedExistType.EXIST;
      } else {
        this.notesArchivedExist = notesArchivedExistType.NOTEXIST;
      }
      this.archivedNotes = result as unknown as noteType[];
    },

    removeNoteById(id: string) {
      this.notes.splice(id.split("_")[0] as unknown as number, 1);

      if (this.notes.length <= 0) {
        this.notesExist = noteExistType.NOTEXIST;
      }
    },
    removeArchivedNoteById(id: string) {
      this.archivedNotes.splice(id.split("_")[0] as unknown as number, 1);

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
  },
});
