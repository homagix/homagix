import type { User } from "~/types"
import { generateToken } from "@/server/AuthHelper.js"
import { useUsers } from "../model/Users"

export default defineEventHandler(async event => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // wait a second to prevent brute force attacks
  const { firstName, password } = (await readBody(event)) as User
  const { getByFirstNameAndPassword } = await useUsers()

  const user = getByFirstNameAndPassword(firstName, password!)
  if (user) {
    return { token: generateToken(user) }
  }

  throw createError({ statusCode: 400, message: "Invalid credentials" })
})
