import { describe, it, expect } from "vitest"
import { setup } from "@nuxt/test-utils"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import AppTable from "./AppTable.vue"

type Entry = { firstName: string; repo: string }

describe("AppTable", () => {
  setup({ server: false })

  it("renders as expected", async () => {
    const wrapper = await mountSuspended(AppTable, {
      props: {
        columnNames: ["First name", "Repository"],
        list: [
          { firstName: "Arnie", repo: "https://github.com/arnie/recipes" },
          { firstName: "John", repo: "https://github.com/john/recipes" },
        ],
      },
      slots: {
        default: ({ entry }) => JSON.stringify(entry),
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
