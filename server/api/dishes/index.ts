import { useDishes } from "~/server/model/Dishes"
import { useIngredients } from "~/server/model/Ingredients"
import { DishListEntry } from "~/types"

export default defineEventHandler(async () => {
  const { getDishes } = await useDishes()
  const { getIngredients } = await useIngredients()
  const dishes = getDishes()

  return {
    dishes: dishes.map(
      (dish): DishListEntry => ({
        name: dish.name,
        url: `/recipes/${dish.user.id}/${dish.id}`,
        user: dish.user.firstName ?? dish.user.id.substring(0, 8),
        ingredientNames: getIngredients(dish.ingredients.map(i => i.id)).map(i => i.name.toLowerCase()),
      })
    ),
  }
})
