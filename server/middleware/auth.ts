import { decode } from "jsonwebtoken"

export default defineEventHandler(event => {
  if (!event.path.match(/^\/api/)) {
    return
  }

  event.context.auth = undefined
  const authHeader = getHeader(event, "Authorization")
  const token = authHeader?.match(/^Bearer (.*)$/)?.at(1) || parseCookies(event)["token"]
  if (token) {
    try {
      const decoded = decode(token) as { exp: number }
      if (decoded.exp >= Date.now() / 1000) {
        event.context.auth = decoded
      } else {
        throw createError({ statusCode: 401, message: "Token expired" })
      }
    } catch {
      throw createError({ status: 401, message: "Invalid token" })
    }
  }
})
