import type { DishReference, User } from "~/types"

const storage = useStorage("data")

export default defineEventHandler(async () => {
  const keys = await storage.getKeys("dishes")
  const users = (await storage.getItem("users")) as User[]
  const dishes = await Promise.all(
    keys.map(async key => {
      const list = (await storage.getItem(key)) as DishReference[]
      const [, userId] = key.split(":")
      return list.map(dish => ({
        name: dish.name,
        url: `/recipes/${userId}/${dish.id}`,
        user: users.find(user => user.id === userId)?.firstName,
      }))
    })
  )

  return {
    dishes: dishes.flat(),
  }
})
