import { ingredients } from "~/server/ingredients"
import { dishes } from "../../dishes"
import { FullItem } from "~/types"

export default defineEventHandler(event => {
  const id = getRouterParam(event, "id")
  const dish = dishes.find(dish => dish.id === id)
  if (!dish) {
    throw createError({ statusCode: 404, statusMessage: "dish not found" })
  }

  return {
    ...dish,
    items: dish.items.map(
      item =>
        ({
          ...item,
          ingredient: ingredients.find(ingredient => ingredient.id === item.id),
        } as FullItem)
    ),
  }
})
