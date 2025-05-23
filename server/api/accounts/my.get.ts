import type { UUID } from "node:crypto"
import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useFavorites } from "~/server/model/Favorites"
import { useUsers } from "~/server/model/Users"

export default defineEventHandler(async event => {
  const { getReadableUserFields } = await useUsers()
  const user = await getAuthenticatedUser(event)
  const favorites = useFavorites(user)

  return {
    ...getReadableUserFields(user),
    favorites: (await favorites.get()) as UUID[],
  }
})
