type ID = string

export type User = {
  id: ID
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

export type Item = {
  id: ID
  amount: number
}

export type Ingredient = {
  amount: number
  unit: string
  name: string
  group: string
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

export type StoredIngredient = { id: ID } & Omit<Ingredient, "amount">

export type DishReference = {
  id: ID
  name: string
  mainImage?: string
  path: string
}
