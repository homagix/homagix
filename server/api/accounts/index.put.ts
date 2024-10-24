import type { User } from "~/types"
import { scryptSync, randomBytes } from "crypto"
import { generateToken } from "@/server/AuthHelper.js"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  if (!event.context.auth) {
    throw createError({ statusCode: 401, message: "Not authenticated" })
  }
  const { id, firstName, password } = (await readBody(event)) as Partial<User>
  if (id !== event.context.auth.id) {
    throw createError({ statusCode: 403, message: "Can only set own user data"})
  }
  const users = ((await storage.getItem("users")) || []) as User[]
  const user = users.find(user => user.id === event.context.auth.id)
  if (!user) {
    throw createError({ statusCode: 400, statusMessage: "User not found" })
  }
  
  if (firstName) {
    user.firstName = firstName
  }

  if (password) {
    const salt = randomBytes(16).toString("hex")
    const buf = scryptSync(password, salt, 64) as Buffer
    user.password = `${buf.toString("hex")}.${salt}`
  }

  await storage.setItem("users", users)
  return { token: generateToken(user) }
})
