import type { UUID } from "node:crypto"
import { decode } from "jsonwebtoken"

export default defineEventHandler(event => {
  if (!event.path.match(/^\/api/)) {
    return
  }

  event.context.auth = undefined
  event.context.authStatus = "anonymous"
  const authHeader = getHeader(event, "Authorization")
  const token = authHeader?.match(/^Bearer (.*)$/)?.at(1) || parseCookies(event)["token"]
  if (token) {
    try {
      const decoded = decode(token) as { id: UUID; exp: number }
      if (decoded === null) {
        throw createError({ statusCode: 401, message: "Invalid token" })
      } else if (decoded.exp < Date.now() / 1000) {
        event.context.authStatus = "expiredToken"
      } else {
        event.context.auth = decoded
        event.context.authStatus = "authenticated"
      }
    } catch (error) {
      throw createError({ statusCode: 401, message: (error as Error).message })
    }
  }
})
