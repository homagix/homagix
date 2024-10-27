import type { User } from "~/types"
import { generateToken, validatePassword } from "@/server/AuthHelper.js"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // wait a second to prevent brute force attacks
  const body = (await readBody(event)) as User

  const users = ((await storage.getItem("users")) || []) as User[]
  const user = users.find(user => user.firstName === body.firstName && validatePassword(user.password!, body.password!))

  if (user) {
    return { token: generateToken(user) }
  }

  throw createError({ statusCode: 400, message: "Invalid credentials" })
})
