import type { H3Event } from "h3"
import { decode } from "jsonwebtoken"

export default defineEventHandler(event => {
  if (!event.path.match(/^\/api/)) {
    return
  }

  const getTokenFromAuthHeader = (event: H3Event) =>
    getHeader(event, "Authorization")
      ?.match(/^Bearer (.*)$/)
      ?.at(1)

  const getTokenFromCookie = (event: H3Event) => parseCookies(event)["token"]

  const token = [getTokenFromAuthHeader, getTokenFromCookie]
    .map(strategy => strategy(event))
    .filter(t => t)
    .at(0)

  event.context.auth = undefined
  if (token) {
    try {
      const decoded = decode(token) as { exp: number }
      if (decoded.exp >= Date.now() / 1000) {
        event.context.auth = decoded
      }
    } catch {
      // ignore errors while decoding, just keep the auth context undefined
    }
  }
})
