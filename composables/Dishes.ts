import type { DishListEntry } from "~/types"

const dishes = ref<DishListEntry[] | undefined>(undefined)

export const useDishes = async () => {
  const user = useUser()

  if (dishes.value === undefined) {
    const data = (await callApi("/api/dishes")) as { dishes: DishListEntry[] }
    dishes.value = data.dishes
  }

  function addFavoriteFlag(dish: DishListEntry) {
    return { ...dish, favorite: user.value?.favorites?.has(dish.id) }
  }

  return {
    allDishes: () => dishes.value?.map(addFavoriteFlag),
  }
}