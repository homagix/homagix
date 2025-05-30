// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-19",
  devtools: { enabled: true },
  nitro: {
    storage: {
      db: { driver: "fs", base: ".data/kv" },
    },
    devStorage: {
      db: { driver: "fs", base: ".data/kv" },
    },
    esbuild: {
      options: { target: "esnext" },
    },
  },
  vite: {
    css: {
      preprocessorOptions: { scss: { api: "modern-compiler" } },
    },
  },
  modules: ["@nuxt/test-utils/module"],
  experimental: { asyncContext: true },
})
