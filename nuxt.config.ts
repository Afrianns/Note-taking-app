// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    databaseUrl: '',
    resendKey: '',
  },
  // routeRules: {
  //   "/archived": { ssr: false },
  //   "/setting": { ssr: true },
  //   "/setting/*": { ssr: false },
  // },
});
