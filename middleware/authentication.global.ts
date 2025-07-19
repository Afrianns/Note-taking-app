import { useSession } from "~/lib/auth-client";
import { useSessionStore } from "~/store/storage";

enum noteExistType {
    DEFAULT,
    NOTEXIST,
    EXIST,
}
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await useSession(useFetch);

  console.log(to.path);

  if (!session.value) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
  } else {
    if (to.path == "/") {
      return navigateTo("/dashboard");
    }
  }
});
