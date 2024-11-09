import { randomUUID, type UUID } from "node:crypto"
import { User } from "~/types"
import { generateToken, validatePassword } from "../AuthHelper"
import { useDishes } from "./Dishes"

const storage = useStorage("data")

let users: User[]

const writableFields = ["firstName", "repository", "password"] as const
export type WritableFields = (typeof writableFields)[number]

export async function useUsers() {
  if (users === undefined) {
    users = ((await storage.getItem("users")) || []) as User[]
  }

  const { updateDishesFromRepository } = await useDishes()

  return {
    getAll() {
      return users
    },

    getById(id: UUID) {
      return users.find(user => user.id === id)
    },

    getByFirstNameAndPassword(firstName: string, password: string) {
      return users.find(
        user => user.firstName === firstName && user.password && validatePassword(user.password, password)
      )
    },

    getByRepository(repository: string) {
      return users.find(user => user.repository === repository)
    },

    async register(firstName: string) {
      const user: User = { id: randomUUID(), firstName, role: "reader" }
      users.push(user)
      await storage.setItem("users", users)
      return { token: generateToken(user) }
    },

    async updateUser(data: Pick<User, "id" | Partial<WritableFields>>) {
      const user = users.find(u => u.id === data.id)
      if (!user) {
        throw createError({ statusCode: 401, message: "User not found" })
      }
      const repoIsModified = data.repository !== user.repository
      const fields = writableFields.filter(f => user.role !== "reader" || f !== "repository")
      updateDefinedFields(user, data, fields)
      await storage.setItem("users", users)

      if (repoIsModified && user.role !== "reader") {
        await updateDishesFromRepository(user)
      }
    },
  }
}

function updateDefinedFields<T extends object>(target: T, source: Partial<T>, fields: readonly (keyof T)[]): T {
  fields.forEach(field => {
    if (source[field] !== undefined) {
      target[field] = source[field] as T[keyof T]
    }
  })
  return target
}
