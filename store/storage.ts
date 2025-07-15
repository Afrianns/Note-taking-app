import { getSession } from "~/lib/auth-client";

type useSessionStoreType = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};

type noteType = {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const useSessionStore = defineStore("sessionStore", {
  state: () => ({
    credential: {
      emailVerified: true,
    } as useSessionStoreType,
    notes: [] as noteType[],
  }),
  actions: {
    async getUserCredential() {
      const { data } = await getSession();
      console.log(data)
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
      this.notes = result as unknown as noteType[];
    },
  },
});
