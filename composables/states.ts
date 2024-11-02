import { type WordCloud, type User, type DishListEntry } from "~/types"

const user = ref<User | null>(null)
export const useUser = async () => {
  const token = useCookie("token")

  async function fetchUser() {
    try {
      const data = await $fetch("/api/accounts/my")
      user.value = data
    } catch (err) {
      user.value = null
      console.error((err as { data: { message: string } }).data?.message ?? (err as Error).message)
    }
  }

  watch(token, async (newToken, oldToken) => {
    if (newToken !== oldToken) {
      await fetchUser()
    }
  })

  if (user.value === null) {
    await fetchUser()
  }

  return user
}

const data = ref<WordCloud | undefined>(undefined)
export const useWordcloud = async () => {
  if (data.value === undefined) {
    data.value = await $fetch("/api/wordclouds")
  }
  return data
}

const dishes = ref<DishListEntry[] | undefined>(undefined)
export const useDishes = async () => {
  if (dishes.value === undefined) {
    dishes.value = (await $fetch("/api/dishes")).dishes
  }
  return {
    allDishes: () => dishes.value,

    byIngredientName(ingredientName: string) {
      const lcIngredient = ingredientName.toLowerCase()
      return dishes.value?.filter(dish => dish.ingredientNames.some(name => name.localeCompare(lcIngredient) === 0))
    },
  }
}
