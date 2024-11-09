import type { UUID } from "node:crypto"

export type AuthStatus = "anonymous" | "authenticated" | "expiredToken"

export type User = {
  id: UUID
  firstName: string
  password?: string
  passwordSet?: boolean
  repository?: string
}

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

export type Dish = Omit<RawDish, "items"> & {
  ingredients: Ingredient[]
}

export type DishEntity = {
  id: UUID
  name: string
  path: string
  ingredients: string[]
}

export type DishListEntry = {
  name: string
  url: string
  user: string
  ingredientNames: string[]
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
