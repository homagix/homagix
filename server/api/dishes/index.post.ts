import { randomUUID } from "node:crypto"
import type { DishReference, User } from "~/types"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const reference = (await readBody(event)) as Omit<DishReference, "id">
  const user = event.context.auth as User | undefined

  if (user === undefined) {
    throw createError({ status: 401, message: "Need to be logged in to add dishes" })
  }
  if (reference.name === undefined) {
    throw createError({ status: 400, message: "Missing name of dish" })
  }
  if (!reference.url.match(/^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/)) {
    throw createError({ status: 400, message: "Url field seems not to be a valid URL" })
  }

  const dishes = ((await storage.getItem("dishes:" + user.id)) || []) as DishReference[]

  if (dishes.findIndex(dish => dish.name.toLowerCase() === reference.name.toLowerCase()) !== -1) {
    throw createError({ status: 409, message: "A dish with this name already exists" })
  }

  dishes.push({
    id: randomUUID(),
    name: reference.name.toString(),
    url: reference.url.toString(),
    mainImage: reference.mainImage?.toString(),
  })
  await storage.setItem("dishes:" + user.id, dishes)

  return { success: true }
})
