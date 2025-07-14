import { useSession } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await useSession(useFetch);
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
