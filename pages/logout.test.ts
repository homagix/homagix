import { afterEach, describe, expect, it, vi } from "vitest"
import LogoutPage from "./logout.vue"
import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { setup } from "@nuxt/test-utils"
import { mount } from "@vue/test-utils"
import { useMockedCookie } from "~/utils/TestMocks"

const push = vi.fn()

describe("LogoutPage component", () => {
  setup({ server: false })

  afterEach(() => vi.restoreAllMocks())

  it("renders the title and description", async () => {
    const wrapper = mount(LogoutPage)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("sets the token cookie to null", async () => {
    mockNuxtImport("useCookie", () => () => useMockedCookie())
    const cookie = useCookie("token")
    cookie.value = "test-cookie"
    mount(LogoutPage)
    expect(cookie.value).toEqual(null)
  })

  it('navigates to "/" when the button is clicked', async () => {
    mockNuxtImport("useRouter", () => vi.fn(() => ({ push })))
    const wrapper = mount(LogoutPage)
    const button = wrapper.find("#recipes-button")
    await button.trigger("click")

    expect(push).toHaveBeenCalledWith("/")
  })
})
