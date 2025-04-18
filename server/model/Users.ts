import { randomUUID, type UUID } from "node:crypto"
import { UpdateUserData, User, writableUserFields } from "~/types"
import { generateToken, hashPassword, validatePassword } from "../AuthHelper"
import { useDishes } from "./Dishes"
import { isValidURL } from "~/utils/Validations"

const storage = useStorage("data")

let users: User[]

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

    async updateUser(user: User, data: UpdateUserData, authUser: User) {
      validateUpdateFields(user, data, authUser)

      const repoIsModified = data.repository !== undefined && data.repository !== user.repository

      updateDefinedFields(user, data, writableUserFields)
      await storage.setItem("users", users)

      if (repoIsModified && user.role !== "reader") {
        await updateDishesFromRepository(user)
      }

      return user
    },

    getReadableUserFields(user: User) {
      return {
        ...user,
        repository: user.repository && `https://github.com/${user.repository}`,
        passwordSet: user.password !== undefined,
        password: undefined,
        role: user.role,
      }
    },
  }
}

function validateUpdateFields(user: User, data: UpdateUserData, authUser: User) {
  if (authUser.id !== user.id && authUser.role !== "admin") {
    throw createError({ status: 403, message: "Not allowed to update this user" })
  }
  if (data.role && authUser.role !== "admin") {
    throw createError({ status: 403, message: "Not allowed to update role field" })
  }
  if (data.password) {  // a new password is set
    if (user.password) {  // the user already has a password
      if (!data.currentPassword) {  // the user has not provided the current password
        throw createError({ statusCode: 400, message: "Missing current password" })
      }
      if (!validatePassword(user.password!, data.currentPassword!)) {
        throw createError({ statusCode: 400, message: "Current password does not match" })
      }
    }
    data.password = hashPassword(data.password)
  }
  if (data.repository) {
    if (!isValidURL(data.repository)) {
      throw createError({ statusCode: 400, message: "Repository URL does not seem valid" })
    }
    data.repository = normalizeRepo(data)
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

function normalizeRepo(data: { repository?: string }) {
  if (!data.repository) {
    return ""
  }
  return new URL(data.repository).pathname.replace(/\/(\w+)\/(\w+).*/, "$1/$2")
}
