import { describe, it, expect } from "vitest"
import { setup } from "@nuxt/test-utils"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import AppTabs from "./AppTabs.vue"

const tabs = [
  { id: "tab-1", label: "My tab no 1" },
  { id: "tab-2", label: "My tab no 2" },
]
describe("AppTabs", () => {
  setup({ server: false })

  it("renders as expected", async () => {
    const wrapper = await mountSuspended(AppTabs, {
      props: { labelField: "label", tabs, modelValue: tabs[1] },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("reacts on tab switches", async () => {
    const wrapper = await mountSuspended(AppTabs, {
      props: { labelField: "label", tabs, modelValue: tabs[1] },
    })
    expect(wrapper.emitted()).toEqual({})
    await wrapper.find("a").trigger("click")
    expect(wrapper.html()).toMatchSnapshot()
  })
})
