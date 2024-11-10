import { getAuthenticatedUser } from "~/server/AuthHelper"
import { useUsers } from "~/server/model/Users"

const { getReadableUserFields } = await useUsers()

export default defineEventHandler(async event => {
  const user = await getAuthenticatedUser(event)

  return getReadableUserFields(user)
})
