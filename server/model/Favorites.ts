import type { UUID } from "node:crypto"
import { User } from "~/types"

const storage = useStorage("data")
const favorites = {} as Record<UUID, UUID[]>

export function useFavorites(user?: User) {
  if (!user) {
    const notAuthenticated = () => createError({ status: 401, message: "Not authenticated" })
    return {
      get: notAuthenticated,
      add: notAuthenticated,
      remove: notAuthenticated,
    }
  }
  const userId = user.id
  const key = "favorites:" + userId
  const save = async () => await storage.setItem(key, favorites[userId])

  return {
    async get() {
      if (!favorites[userId]) {
        favorites[userId] = (await storage.getItem(key)) ?? []
      }
      return favorites[userId]
    },

    async add(dishId: UUID) {
      favorites[userId] = [...new Set((favorites[userId] ?? []).concat(dishId))]
      await save()
    },

    async remove(dishId: UUID) {
      favorites[userId] = (favorites[userId] ?? []).filter(f => f !== dishId)
      await save()
    },
  }
}
