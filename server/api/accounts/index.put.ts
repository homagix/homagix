import type { User } from "~/types"
import type { H3Event } from "h3"
import { generateToken, hashPassword, validatePassword } from "@/server/AuthHelper.js"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const { data, user, users } = await getValidatedData(event)

  hashPassword(data)
  updateDefinedFields(user, data, ["firstName", "password"])

  await storage.setItem("users", users)
  return { token: generateToken(user) }
})

async function getValidatedData(event: H3Event) {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }
  const data = (await readBody(event)) as Partial<User> & { currentPassword?: string }
  if (data.id !== event.context.auth.id) {
    throw createError({ statusCode: 403, message: "Can only set own user data" })
  }
  const users = ((await storage.getItem("users")) || []) as User[]
  const user = users.find(user => user.id === event.context.auth.id)
  if (!user) {
    throw createError({ statusCode: 400, message: "User not found" })
  }
  if (user.password && data.password && !data.currentPassword) {
    throw createError({ statusCode: 400, message: "Missing current password" })
  }
  if (data.password && !validatePassword(user.password!, data.currentPassword!)) {
    throw createError({ statusCode: 400, message: "Current password does not match" })
  }
  return { data, user, users }
}

function updateDefinedFields<T extends object>(target: T, source: Partial<T>, fields: (keyof T)[]): T {
  fields.forEach(field => {
    if (source[field] !== undefined) {
      target[field] = source[field] as T[keyof T]
    }
  })
  return target
}
