type ID = string

export type User = {
  id: ID
  firstName: string
  password?: string
  passwordSet?: boolean
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

export type Dish = {
  name: string
  images?: string[]
  recipe?: string
  source?: string
  ingredients: Ingredient[]
}

export type StoredDish = {
  id: ID
  items: Item[]
  last?: string
  alwaysOnList: boolean
  isFavorite?: boolean
  isEditable: boolean
  ownedBy?: ID
} & Omit<Dish, "ingredients">

export type StoredIngredient = { id: ID } & Omit<Ingredient, "amount">

export type DishReference = {
  id: ID
  name: string
  mainImage?: string
  url: string
}
