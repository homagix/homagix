import { parse } from "yaml"
import { StoredDish, DishReference, Dish, Ingredient } from "~/types"

type RawDish = Omit<StoredDish, "items"> & {
  items: string[]
}

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const userId = getRouterParam(event, "userId")
  const dishId = getRouterParam(event, "dishId")
  const dishRef = ((await storage.getItem("dishes:" + userId)) as DishReference[]).find(dish => dish.id === dishId)
  if (!dishRef) {
    throw createError({ statusCode: 404, statusMessage: "dish not found" })
  }

  const dish = parse(await $fetch(dishRef.url)) as RawDish
  const ingredients = dish.items.map(item => {
    const [amount, unit, name] = item.split(" ", 3)
    return { amount: Number(amount), unit, name } as Ingredient
  })
  const basePath = dishRef.url.slice(0, dishRef.url.lastIndexOf("/") + 1)
  const images = dish.images?.map(image => basePath + image) || []

  return { ...dish, ingredients, items: undefined, images } as Dish
})
