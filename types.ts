import type { UUID } from "node:crypto"

export type AuthStatus = "anonymous" | "authenticated" | "expiredToken"

export const roles = ["reader", "author", "admin"] as const
export type Role = typeof roles[number]

export type User = {
  id: UUID
  firstName: string
  password?: string
  passwordSet?: boolean
  repository?: string
  role: Role
}

export const writableUserFields = ["firstName", "repository", "password", "role"] as const
export type WritableUserFields = (typeof writableUserFields)[number]
export type UpdateUserData = Partial<Pick<User, WritableUserFields> & { currentPassword?: string }>

export type AppError = {
  message: string
  details?: unknown
  link?: string
}

export type Ingredient = {
  amount: number
  unit: string
  name: string
  group: string
}
export type IngredientEntity = {
  id: UUID
  name: string
  units: string[]
}

export type RawDish = {
  name: string
  images?: string[]
  recipe?: string
  source?: string
  items: string[]
}

export type DishFilter = { ingredientName?: string; userId?: UUID }

export type Dish = Omit<RawDish, "items"> & {
  ingredients: Ingredient[]
  userName: string
}

export type DishEntity = {
  id: UUID
  name: string
  path: string
  ingredients: string[]
  user: User
}

export type DishListEntry = {
  name: string
  url: string
  ingredientNames: string[]
  userName: string
  userId: UUID
}

export type WordCloud = [string, number][]

export interface PublicConfiguration {
  allowRegistration: boolean
}

export interface SecretConfiguration {
  jwtSecret: string
  webhookSecret: string
}

export type Configuration = PublicConfiguration & { secrets: SecretConfiguration }
