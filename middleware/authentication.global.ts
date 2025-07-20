import { useSession } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = await useSession();

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
