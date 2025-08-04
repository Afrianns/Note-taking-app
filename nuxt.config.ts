// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/ui", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    nuxtDbUrl: process.env.NUXT_DATABASE_URL,
    resendAPI: process.env.RESEND_API_KEY,
  },
  // routeRules: {
  //   "/archived": { ssr: false },
  //   "/setting": { ssr: true },
  //   "/setting/*": { ssr: false },
  // },
});
