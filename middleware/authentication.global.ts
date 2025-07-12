import { useSession } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await useSession(useFetch);
  if (!session.value) {
    if (
      to.path === "/home" ||
      to.path === "/setting" ||
      to.path === "/setting/*"
    ) {
      return navigateTo("/");
    }
  } else {
    if (to.path == "/") {
      return navigateTo("/home");
    }
  }
});
