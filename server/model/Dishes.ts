import yaml from "yaml"
import { randomUUID, type UUID } from "node:crypto"
import { DishEntity, RawDish, User } from "~/types"
import { useIngredients } from "./Ingredients"
import type { H3Event } from "h3"

type Tree = {
  sha: string
  path: string
  url: string
}

type DishReference = {
  id: UUID
  path: string
  name: string
  ingredients: string[]
}

const storage = useStorage("data")

let dishes: DishEntity[]

export async function useDishes() {
  const users = (await storage.getItem("users")) as User[]
  const { getIngredientNamesFromItems } = await useIngredients()

  function getUserById(id: UUID) {
    return users.find(user => user.id === id) ?? ({ id: id.substring(0, 8), firstName: "Unknown" } as User)
  }

  const dishClass = {
    async refresh() {
      dishes = (await getRawDishes()).flatMap(({ userId, dishes }) => {
        return dishes.map(dish => toDishReference(dish, userId as UUID))
      })
    },

    getDishes() {
      return dishes
    },

    async updateDishesFromRepository(user: User) {
      try {
        const files = (await $fetch(`https://api.github.com/repos/${user.repository}/git/trees/main`)) as {
          tree: Tree[]
        }
        const newDishes = await files.tree
          .filter(file => file.path.match(/\.ya?ml$/))
          .reduce(async (promise, dish) => {
            const url = `https://raw.githubusercontent.com/${user.repository}/refs/heads/main/${dish.path}`
            return (await promise).concat(await fromUrl(url, dish.path, user.id))
          }, Promise.resolve([] as DishReference[]))

        await storage.setItem("dishes:" + user.id, newDishes)
        await dishClass.refresh()
      } catch (error) {
        if ((error as { data: { status: string } }).data?.status === "404") {
          throw createError({ status: 404, message: "Unknown repository" })
        }
        throw createError({ status: 500, message: (error as Error).message })
      }
    },

    getdishIdFromRoute(event: H3Event) {
      const dishId = getRouterParam(event, "id") as UUID
      if (!dishes.some(dish => dish.id === dishId)) {
        throw createError({ status: 400, message: "Unknown dish" })
      }
      return dishId
    },
  }

  async function fromUrl(url: string, path: string, userId: string) {
    try {
      const existingDishes = ((await storage.getItem("dishes:" + userId)) ?? []) as DishEntity[]
      const data = yaml.parse((await $fetch(url)) as string) as RawDish
      if (!data.name) {
        throw new Error(`Missing name attribute`)
      }
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error(`'items' attribute is missing or not a list`)
      }
      return {
        id: existingDishes.find(dish => dish.name === data.name)?.id ?? randomUUID(),
        path,
        name: data.name,
        ingredients: getIngredientNamesFromItems(data.items),
      } as DishReference
    } catch (error) {
      throw new Error(`Reading from '${path}' failed: ${(error as Error).message}`, { cause: error })
    }
  }

  if (dishes === undefined) {
    await dishClass.refresh()
  }
  return dishClass

  async function getRawDishes() {
    const keys = await storage.getKeys("dishes")
    return await Promise.all(
      keys.map(async key => {
        const [, userId] = key.split(":")
        const dishes = (await storage.getItem(key)) as DishEntity[]
        return { userId, dishes }
      })
    )
  }

  function toDishReference(dish: DishEntity, userId: UUID) {
    return {
      id: dish.id,
      name: dish.name,
      path: dish.path,
      ingredients: dish.ingredients,
      user: getUserById(userId),
    }
  }
}
