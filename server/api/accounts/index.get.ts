import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useUsers } from "~/server/model/Users"

export default defineEventHandler(async event => {
  const user = await getAuthenticatedUser(event)
  if (user.role !== "admin") {
    return createError({ status: 403, message: "Not authorized to access user list" })
  }

  const { getAll, getReadableUserFields } = await useUsers()

  return getAll().map(getReadableUserFields)
})
