import { defineVitestConfig } from "@nuxt/test-utils/config"

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    dir: '.',
    include: ["**/*.test.ts"],
    globals: true,
    onConsoleLog: (log) => !log.includes('<Suspense> is an experimental feature')
  },
})
