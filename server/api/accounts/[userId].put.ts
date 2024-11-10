import { type UUID } from "node:crypto"
import type { UpdateUserData } from "~/types"
import { getAuthenticatedUser } from "@/server/AuthHelper.js"
import { useUsers } from "~/server/model/Users"

const { getById, getReadableUserFields, updateUser } = await useUsers()

export default defineEventHandler(async event => {
  const authUser = await getAuthenticatedUser(event)
  const user = getById(getRouterParam(event, "userId") as UUID)
  if (!user) {
    throw createError({ statusCode: 401, message: "User not found" })
  }
  const data = (await readBody(event)) as UpdateUserData
  return getReadableUserFields(await updateUser(user, data, authUser))
})
