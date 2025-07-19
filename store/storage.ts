import { getSession } from "~/lib/auth-client";
import { type noteType, noteExistType } from "~/types/types";

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
    notesExist: noteExistType.DEFAULT,
  }),
  actions: {
    async getUserCredential() {
      const { data } = await getSession();
      console.log(data);
      if (data) {
        this.credential = data.user;
        this.getCurrentNoteUser(data.user.id);
      }
    },
    async getCurrentNoteUser(userId: string) {
      const result = await $fetch("/api/allNote", {
        method: "POST",
        body: {
          userId: userId,
        },
      });
      console.log("wht ", result);
      if (result.length > 0) {
        this.notesExist = noteExistType.EXIST;
      } else {
        this.notesExist = noteExistType.NOTEXIST;
      }
      this.notes = result as unknown as noteType[];
    },
  },
});
