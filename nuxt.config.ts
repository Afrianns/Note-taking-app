// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    databaseUrl: import.meta.env.NUXT_DATABASE_URL,
  },
  // routeRules: {
  //   "/archived": { ssr: false },
  //   "/setting": { ssr: true },
  //   "/setting/*": { ssr: false },
  // },
});
