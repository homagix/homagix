import { describe, it, expect } from "vitest"
import { setup } from "@nuxt/test-utils"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import UserName from "~/components/UserName.client.vue"
import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { flushPromises } from "@vue/test-utils"

mockNuxtImport("useCurrentUser", () => {
  return () => ({ currentUser: { firstName: "John" } })
})

describe("UserName", async () => {
  setup({ server: false })
  it("should render as expected", async () => {
    const wrapper = await mountSuspended(UserName)
    await flushPromises()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
