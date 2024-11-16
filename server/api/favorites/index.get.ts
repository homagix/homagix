import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useFavorites } from "~/server/model/Favorites"

export default defineEventHandler(async (event) => {
  const favorites = useFavorites(await getAuthenticatedUser(event))
  return await favorites.get()
})
