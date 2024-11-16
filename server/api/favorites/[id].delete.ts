import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useDishes } from "~/server/model/Dishes"
import { useFavorites } from "~/server/model/Favorites"

const { getdishIdFromRoute } = await useDishes()

export default defineEventHandler(async event => {
  const favorites = useFavorites(await getAuthenticatedUser(event))
  await favorites.remove(getdishIdFromRoute(event))
  return { success: true }
})
