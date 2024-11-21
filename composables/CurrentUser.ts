import type { UUID } from "node:crypto"
import type { User } from "~/types"

type CurrentUser = User & { favorites: Set<UUID> }

const currentUser = ref<CurrentUser | undefined | null>()

export function useCurrentUser() {
  const token = useCookie("token")
  const { replace } = useRouter()
  const { setServerError } = useMessages()

  async function fetchUser() {
    try {
      currentUser.value = null
      const data = await $fetch("/api/accounts/my")
      currentUser.value = {
        ...data,
        favorites: new Set(data.favorites),
      }
    } catch (err) {
      const message = (err as { data: { message: string } }).data?.message ?? (err as Error).message
      console.error(message)
      if (message === "Token expired") {
        token.value = null
      } else {
        console.error(err)
      }
    }
  }

  if (currentUser.value === undefined) {
    currentUser.value = null

    if (token.value) {
      fetchUser()
    }

    watch(token, async (newValue, oldValue) => {
      if (newValue && oldValue !== newValue) {
        await fetchUser()
      } else if (newValue === null) {
        currentUser.value = null
      }
    })
  }

  return {
    currentUser,

    assertLogin() {
      return Boolean(currentUser.value)
    },

    assertRole(role: string) {
      return currentUser.value?.role === role
    },

    async login(firstName: string, password: string) {
      try {
        token.value = undefined
        const result = await $fetch("/api/sessions", { method: "post", body: { firstName, password } })
        token.value = result.token
        replace("/")
      } catch (error) {
        setServerError(error)
      }
    },

    async setFavorite(dishId: UUID) {
      await callApi("/api/favorites/" + dishId, { method: "post" })
      currentUser.value!.favorites?.add(dishId)
    },
    async removeFavorite(dishId: UUID) {
      await callApi("/api/favorites/" + dishId, { method: "delete" })
      currentUser.value!.favorites.delete(dishId)
    },
  }
}
