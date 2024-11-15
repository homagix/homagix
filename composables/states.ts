import type { WordCloud, User, DishListEntry, PublicConfiguration, DishFilter } from "~/types"

const user = ref<User | undefined | null>()
export const useUser = () => {
  const token = useCookie("token")

  async function fetchUser() {
    try {
      if (!token.value) {
        user.value = null
        return
      }
      const data = await $fetch("/api/accounts/my")
      user.value = data
    } catch (err) {
      user.value = null
      const message = (err as { data: { message: string } }).data?.message ?? (err as Error).message
      console.error(message)
      if (message === "Token expired") {
        token.value = undefined
      }
    }
  }

  watch(token, async newToken => await fetchUser(), { immediate: true })

  return user
}

const users = ref<User[] | undefined>()
export const useUsers = async () => {
  if (users.value === undefined) {
    users.value = await $fetch("/api/accounts")
  }
  return {
    getAll() {
      return users
    },

    async update(id: string, user: Partial<User>) {
      const modifiedUser = (await $fetch(`/api/accounts/${id}`, { method: "PUT", body: user })) as User
      users.value = users.value?.map(u => (u.id === modifiedUser.id ? modifiedUser : u))
    },
  }
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

    filteredDishes(filter: DishFilter) {
      if (filter.ingredientName) {
        filter.ingredientName = filter.ingredientName.toLowerCase()
      }
      return dishes.value?.filter(dish => {
        return (
          (filter.ingredientName === undefined ||
            dish.ingredientNames.some(name => name.localeCompare(filter.ingredientName!) === 0)) &&
          (filter.userId === undefined || dish.userId === filter.userId)
        )
      })
    },
  }
}

const config = ref<PublicConfiguration | undefined>()
export const useConfiguration = async () => {
  if (config.value === undefined) {
    config.value = await $fetch("/api/configurations")
  }
  return {
    isRegistrationAllowed: () => Boolean(config.value?.allowRegistration),
  }
}
