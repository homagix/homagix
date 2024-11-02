import type { UUID } from "node:crypto"
import type { AuthStatus, User } from "./types"

declare module "h3" {
  interface H3EventContext {
    auth?: { id: UUID; exp: number }
    authStatus: AuthStatus
  }
}
