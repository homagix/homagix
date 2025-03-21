import type { H3Event } from "h3"
import { User } from "~/types"
import { getJwtSecret } from "./Configuration"
import jwt from "jsonwebtoken"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { useUsers } from "./model/Users"

const { sign } = jwt
const expiresIn = "1d"

export function generateToken(user: User) {
  return sign({ id: user.id }, getJwtSecret(), { expiresIn })
}

export function validatePassword(storedPassword: string, suppliedPassword: string) {
  if (!storedPassword) {
    return false
  }
  const [hashedPassword, salt] = storedPassword.split(".")
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex")
  const suppliedPasswordBuf = scryptSync(suppliedPassword, salt, 64) as Buffer
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const buf = scryptSync(password, salt, 64) as Buffer
  return `${buf.toString("hex")}.${salt}`
}

export async function getAuthenticatedUser(event: H3Event) {
  if (event.context.authStatus !== "authenticated") {
    const message = event.context.authStatus === "expiredToken" ? "Token expired" : "Not Authenticated"
    throw createError({ statusCode: 401, message })
  }
  const { getById } = await useUsers()
  const user = getById(event.context.auth!.id)
  if (!user) {
    throw createError({ statusCode: 400, message: "User not found" })
  }
  return user
}
