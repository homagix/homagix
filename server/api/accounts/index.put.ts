import type { User } from "~/types"
import type { H3Event } from "h3"
import { generateToken, getAuthenticatedUser, hashPassword, validatePassword } from "@/server/AuthHelper.js"
import { isValidURL } from "~/utils/Validations"
import { useUsers, WritableFields } from "~/server/model/Users"

type RequestData = Pick<User, "id" | Partial<WritableFields>> & { currentPassword?: string }

export default defineEventHandler(async event => {
  const { updateUser } = await useUsers()
  const { data, user } = await getValidatedData(event)

  hashPassword(data)
  normalizeRepo(data)

  await updateUser(data)
  return { token: generateToken(user) }
})

async function getValidatedData(event: H3Event) {
  const user = await getAuthenticatedUser(event)
  const data = (await readBody(event)) as RequestData
  if (!data.id) {
    throw createError({ statusCode: 400, message: "Missing user id" })
  }
  if (data.id !== user.id) {
    throw createError({ statusCode: 403, message: "Can only set own user data" })
  }
  if (user.password && data.password && !data.currentPassword) {
    throw createError({ statusCode: 400, message: "Missing current password" })
  }
  if (data.password && user.password && !validatePassword(user.password!, data.currentPassword!)) {
    throw createError({ statusCode: 400, message: "Current password does not match" })
  }
  if (data.repository && !isValidURL(data.repository)) {
    throw createError({ statusCode: 400, message: "Repository URL does not seem valid" })
  }
  return { data, user }
}

function normalizeRepo(data: { repository?: string }) {
  if (!data.repository) {
    return ""
  }
  data.repository = new URL(data.repository).pathname.replace(/\/(\w+)\/(\w+).*/, "$1/$2")
}
