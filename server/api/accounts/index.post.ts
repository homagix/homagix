import { useUsers } from "~/server/model/Users"

export default defineEventHandler(async event => {
  const { firstName } = await readBody(event)
  const { register } = await useUsers()

  // Not yet activated to prevent new registrations
  // return await register(firstName)
})
