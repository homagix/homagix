import { User } from "~/types"

export default defineEventHandler((event) => {
  return event.context.auth as User | undefined
})
