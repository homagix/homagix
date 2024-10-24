import { User } from "~/types"
import { getJwtSecret } from "./Configuration"
import jwt from "jsonwebtoken"

const { sign } = jwt
const expiresIn = "1d"

export function generateToken(user: User) {
  const payload = {
    id: user.id,
    firstName: user.firstName,
    passwordSet: user.password !== undefined
  }
  return sign(payload, getJwtSecret(), { expiresIn })
}
