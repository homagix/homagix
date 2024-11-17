import type { UUID } from "node:crypto"
import type { NitroFetchOptions } from "nitropack"
import type { WordCloud, User, DishListEntry, PublicConfiguration } from "~/types"

type CurrentUser = User & {
  favorites: Set<UUID>
  setFavorite: (dishId: UUID) => Promise<void>
  removeFavorite: (dishId: UUID) => Promise<void>
}
const user = ref<CurrentUser | undefined | null>()

export const useUser = () => {
  const token = useCookie("token")
  async function fetchUser() {
    try {
      user.value = null
      const data = await $fetch("/api/accounts/my")
      user.value = {
        ...data,
        favorites: new Set(data.favorites),
        async setFavorite(dishId: UUID) {
          await callApi("/api/favorites/" + dishId, { method: "post" })
          user.value!.favorites?.add(dishId)
        },
        async removeFavorite(dishId: UUID) {
          await callApi("/api/favorites/" + dishId, { method: "delete" })
          user.value!.favorites.delete(dishId)
        },
      }
    } catch (err) {
      const message = (err as { data: { message: string } }).data?.message ?? (err as Error).message
      console.error(message)
      if (message === "Token expired") {
        token.value = null
      }
    }
  }

  if (user.value === undefined && token.value) {
    fetchUser()
  }

  watch(token, async (newValue, oldValue) => {
    if (newValue && oldValue !== newValue) {
      await fetchUser()
    } else if (newValue === null) {
      user.value = null
    }
  })

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
    return { ...dish, favorite: user.value?.favorites?.has(dish.id) }
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
