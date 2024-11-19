import { afterEach, describe, it, expect, vi } from "vitest"
import { mockNuxtImport, registerEndpoint } from "@nuxt/test-utils/runtime"
import { flushPromises, mount } from "@vue/test-utils"
import LoginPage from "./login.vue"
import { useMockedCookie } from "~/utils/TestMocks"
import { RouterLinkStub } from "@vue/test-utils"
import { setup } from "@nuxt/test-utils"

const replace = vi.fn()
const push = vi.fn()
const setServerError = vi.fn()
const reset = vi.fn()
const fetchMock = vi.fn()

vi.mock("#app", () => ({
  useRouter: vi.fn(() => ({ replace, push })),
}))

mockNuxtImport("useMessages", () => () => ({ get: vi.fn(), setServerError, reset }))
mockNuxtImport("useCookie", () => () => useMockedCookie())
registerEndpoint("/login", { method: "POST", handler: fetchMock })

function mountComponent() {
  return mount(LoginPage, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

describe("LoginPage component", () => {
  setup({ server: false })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("renders the title and description", () => {
    const wrapper = mountComponent()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("validates the password correctly", async () => {
    const wrapper = mountComponent()
    const passwordInput = wrapper.find("#login-password")

    await passwordInput.setValue("short")
    expect(passwordInput.classes()).not.toContain("valid")

    await passwordInput.setValue("validPassword123")
    expect(passwordInput.classes()).toContain("valid")
  })

  it.skip("sets the token and navigates to '/' after successful login", async () => {
    const token = "test-token"
    fetchMock.mockImplementation(() => ({ token }))
    mockNuxtImport("useCookie", () => () => useMockedCookie())
    mockNuxtImport("useRouter", () => vi.fn(() => ({ replace })))
    const wrapper = mountComponent()

    await wrapper.find("#login-firstname").setValue("John")
    await wrapper.find("#login-password").setValue("validPassword123")
    await wrapper.find("button").trigger("click")
    await flushPromises()

    expect(replace).toBeCalledWith("/")
    const cookie = useCookie("token")
    expect(cookie.value).toEqual(token)
  })

  it.skip("displays an error message when login fails", async () => {
    const errorMessage = "Invalid credentials"
    vi.stubGlobal("$fetch", () => new Error(errorMessage))

    const wrapper = mountComponent()

    await wrapper.find("#login-firstname").setValue("John")
    await wrapper.find("#login-password").setValue("invalidPassword")
    await wrapper.find("button").trigger("click")

    expect(wrapper.find(".error").text()).toBe("Server-Fehler")
    expect(setServerError).toHaveBeenCalledWith(new Error(errorMessage))
  })

  it("resets messages on keypress", async () => {
    const wrapper = mountComponent()
    const firstnameInput = wrapper.find("#login-firstname")

    await firstnameInput.trigger("keypress")
    expect(reset).toHaveBeenCalled()
  })
})
