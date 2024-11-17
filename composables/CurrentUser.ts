import type { UUID } from "node:crypto"
import type { User } from "~/types"

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
