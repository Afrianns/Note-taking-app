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

export const useSessionStore = defineStore("sessionStore", {
  state: () => ({
    credential: {
      emailVerified: true,
    } as useSessionStoreType,
  }),
  actions: {
    async getUserCredential() {
      const { data } = await getSession();
      if (data) {
        this.credential = data.user;
      }
    },
  },
});
