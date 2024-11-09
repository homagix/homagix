import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useUsers } from "~/server/model/Users"
import { User } from "~/types"

export default defineEventHandler(async event => {
  const user = await getAuthenticatedUser(event)
  if (user.role !== "admin") {
    return [] as User[]
  }

  const users = await useUsers()

  return users.getAll()
})
