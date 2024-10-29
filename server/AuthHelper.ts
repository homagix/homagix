import { User } from "~/types"
import { getJwtSecret } from "./Configuration"
import jwt from "jsonwebtoken"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

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

export function hashPassword(data: Partial<User>) {
  if (data.password) {
    const salt = randomBytes(16).toString("hex")
    const buf = scryptSync(data.password, salt, 64) as Buffer
    data.password = `${buf.toString("hex")}.${salt}`
  }
}
