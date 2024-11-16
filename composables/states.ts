import type { UUID } from "node:crypto"
import type { NitroFetchOptions } from "nitropack"
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
      user.value = await $fetch("/api/accounts/my")
    } catch (err) {
      user.value = null
      const message = (err as { data: { message: string } }).data?.message ?? (err as Error).message
      console.error(message)
      if (message === "Token expired") {
        token.value = undefined
      }
    }
  }

  watch(token, async () => await fetchUser(), { immediate: true })

  return user
}

const users = ref<User[] | undefined>()
export const useUsers = async () => {
  if (users.value === undefined) {
    users.value = await callApi("/api/accounts")
  }
  return {
    getAll() {
      return users
    },

    async update(id: string, user: Partial<User>) {
      const modifiedUser = (await callApi(`/api/accounts/${id}`, { method: "PUT", body: user })) as User
      users.value = users.value?.map(u => (u.id === modifiedUser.id ? modifiedUser : u))
    },
  }
}

const data = ref<WordCloud | undefined>(undefined)
export const useWordcloud = async () => {
  if (data.value === undefined) {
    data.value = await callApi("/api/wordclouds")
  }
  return data
}

const dishes = ref<DishListEntry[] | undefined>(undefined)
export const useDishes = async () => {
  if (dishes.value === undefined) {
    const data = (await callApi("/api/dishes")) as { dishes: DishListEntry[] }
    dishes.value = data.dishes
  }

  function addFavoriteFlag(dish: DishListEntry) {
    return { ...dish, favorite: favorites.value?.has(dish.id) }
  }

  return {
    allDishes: () => dishes.value?.map(addFavoriteFlag),
  }
}

const config = ref<PublicConfiguration | undefined>()
export const useConfiguration = async () => {
  if (config.value === undefined) {
    config.value = await callApi("/api/configurations")
  }
  return {
    isRegistrationAllowed: () => Boolean(config.value?.allowRegistration),
  }
}

const favorites = ref<Set<UUID> | undefined>(new Set(await callApi("/api/favorites")))

export const useFavorites = async () => {
  return {
    async set(dishId: UUID) {
      await callApi("/api/favorites/" + dishId, { method: "post" })
      favorites.value?.add(dishId)
    },

    async remove(dishId: UUID) {
      await callApi("/api/favorites/" + dishId, { method: "delete" })
      favorites.value?.delete(dishId)
    },
  }
}

async function callApi<T>(path: string, options?: NitroFetchOptions<string>) {
  const token = useCookie("token")
  try {
    return (await $fetch(path, options)) as T
  } catch (error) {
    if ((error as { data: { status: number } }).data.status === 401) {
      user.value = undefined
      token.value = undefined
    }
  }
}
