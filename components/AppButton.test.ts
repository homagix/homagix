import { describe, it, expect } from "vitest"
import { setup } from "@nuxt/test-utils"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import AppButton from "./AppButton.vue"

describe("AppButton", () => {
  setup({ server: false })

  it("renders as expected", async () => {
    const wrapper = await mountSuspended(AppButton, { slots: { default: () => "test-button" }})
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("emits click event when anchor tag is clicked", async () => {
    const wrapper = await mountSuspended(AppButton)
    expect(wrapper.emitted()).toEqual({})
    await wrapper.find("a").trigger("click")
    expect(wrapper.emitted("click")).toHaveLength(1)
  })
})
