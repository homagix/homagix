import { getAuthenticatedUser } from "~/server/AuthHelper"

export default defineEventHandler(async event => {
  const user = await getAuthenticatedUser(event)

  return {
    ...user,
    repository: user.repository && `https://github.com/${user.repository}`,
    passwordSet: user.password !== undefined,
    password: undefined,
    role: user.role,
  }
})
