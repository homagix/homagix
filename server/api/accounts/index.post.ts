import type { User } from "~/types"
import { randomUUID } from "node:crypto"
import { generateToken } from "@/server/AuthHelper.js"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as User

  const users = ((await storage.getItem("users")) || []) as User[]
  const user: User = { id: randomUUID(), firstName: body.firstName }
  users.push(user)
  await storage.setItem("users", users)

  return { token: generateToken(user) }
})
