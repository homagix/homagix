import { config } from "~/server/Configuration"
import { useUsers } from "~/server/model/Users"

export default defineEventHandler(async event => {
  if (!config.allowRegistration) {
    return { token: "" }
  }
  const { firstName } = await readBody(event)
  const { register } = await useUsers()

  return await register(firstName)
})
