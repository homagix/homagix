import { useDishes } from "~/server/model/Dishes"
import { DishListEntry } from "~/types"

export default defineEventHandler(async () => {
  const { getDishes } = await useDishes()
  const dishes = getDishes()

  return {
    dishes: dishes.map(
      (dish): DishListEntry => ({
        name: dish.name,
        url: `/recipes/${dish.user.id}/${dish.id}`,
        ingredientNames: dish.ingredients,
        userName: dish.user.firstName ?? dish.user.id.substring(0, 8),
        userId: dish.user.id,
      })
    ),
  }
})
