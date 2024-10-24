import type { User } from "~/types"
import { scryptSync, timingSafeEqual } from "crypto"
import { generateToken } from "@/server/AuthHelper.js"

const storage = useStorage("data")

function comparePassword(storedPassword: string, suppliedPassword: string) {
  if (!storedPassword) {
    return false
  }
  const [hashedPassword, salt] = storedPassword.split(".")
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex")
  const suppliedPasswordBuf = scryptSync(suppliedPassword, salt, 64) as Buffer
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}

export default defineEventHandler(async event => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // wait a second to prevent brute force attacks
  const body = (await readBody(event)) as User

  const users = ((await storage.getItem("users")) || []) as User[]
  const user = users.find(user => user.firstName === body.firstName && comparePassword(user.password!, body.password!))

  if (user) {
    return { token: generateToken(user) }
  }

  throw createError({ statusCode: 400, message: "Invalid credentials" })
})
