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

type ID = string

export type Item = {
  id: ID
  amount: number
}

export type FullItem = Item & {
  ingredient: Ingredient
}

export type Dish = {
  id: ID
  name: string
  images: string[]
  recipe?: string
  source?: string
  last?: string
  items: Item[]
  alwaysOnList: boolean
  isFavorite?: boolean
  isEditable: boolean
  ownedBy?: ID
}

export type Ingredient = {
  id: ID
  amount: number
  unit: string
  name: string
  group: string
}
