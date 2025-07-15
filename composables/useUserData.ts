import { useSessionStore } from "~/store/storage";

export const useUserData = () => {
  const user = useSessionStore();
  if (!user.credential.id) {
    user.getUserCredential();
  }
  return user;
};
