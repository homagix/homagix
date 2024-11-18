import { randomUUID } from "node:crypto"
import { describe, it, expect, vi } from "vitest"
import { setup } from "@nuxt/test-utils"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import type { User } from "~/types"
import UserListEntry from "./UserListEntry.vue"

const update = vi.fn()
mockNuxtImport("useUsers", () => {
  return () => ({ update })
})

const users = await useUsers()

const user: User = {
  id: randomUUID(),
  firstName: "arnold",
  repository: "https://github.com/arnold/t100",
  role: "author",
}

describe("UserListEntry", async () => {
  setup({ server: false })

  it("should render as expected", async () => {
    const wrapper = await mountSuspended(UserListEntry, { props: { user } })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should call the update function when the role is changed", async () => {
    users.update = vi.fn()
    const wrapper = await mountSuspended(UserListEntry, { props: { user } })
    await wrapper.find("select").setValue("admin")
    expect(update).toBeCalledWith(user.id, { role: "admin" })
  })
})
