import { User } from "~/types"

const storage = useStorage("data")

export default defineEventHandler(async event => {
  if (!event.context.auth?.id) {
    throw createError({ statusCode: 403, message: "Not authenticated" })
  }
  const users = ((await storage.getItem("users")) || []) as User[]
  const user = users.find(user => user.id === event.context.auth.id)
  if (!user) {
    throw createError({ statusCode: 400, message: "User not found" })
  }

  return {
    ...user,
    repository: user.repository && `https://github.com/${user.repository}`,
    passwordSet: user.password !== undefined,
    password: undefined,
  }
})
