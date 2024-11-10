import type { UpdateUserData } from "~/types"
import { generateToken, getAuthenticatedUser } from "@/server/AuthHelper.js"
import { useUsers } from "~/server/model/Users"

const { updateUser } = await useUsers()

export default defineEventHandler(async event => {
  const authUser = await getAuthenticatedUser(event)
  const data = (await readBody(event)) as UpdateUserData
  const user = await updateUser(authUser, data, authUser)

  return { token: generateToken(user) }
})
