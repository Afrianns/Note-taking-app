import { useSession, getSession } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
  const sessionn = await getSession();

  if (!sessionn.data) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
  } else {
    if (to.path == "/") {
      return navigateTo("/dashboard");
    }
  }
});
