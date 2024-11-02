import { parse } from "yaml"
import { DishEntity, Dish, Ingredient, User, RawDish } from "~/types"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const userId = getRouterParam(event, "userId")
  const dishId = getRouterParam(event, "dishId")
  const dishRef = ((await storage.getItem("dishes:" + userId)) as DishEntity[]).find(dish => dish.id === dishId)
  const user = (((await storage.getItem("users")) || []) as User[]).find(user => user.id === userId)
  if (!dishRef || !user) {
    throw createError({ statusCode: 404, statusMessage: "dish not found" })
  }

  const url = `https://raw.githubusercontent.com/${user.repository}/refs/heads/main/${dishRef.path}`
  const dish = parse(await $fetch(url)) as RawDish
  const ingredients = dish.items.map(item => {
    const [amount, unit, ...parts] = item.split(" ")
    return { amount: Number(amount), unit, name: parts.join(" ") } as Ingredient
  })
  const basePath = url.slice(0, url.lastIndexOf("/") + 1)
  const images = dish.images?.map(image => basePath + image) || []

  return { ...dish, ingredients, items: undefined, images } as Dish
})
