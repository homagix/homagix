import yaml from "yaml"
import { randomUUID, type UUID } from "node:crypto"
import { DishEntity, RawDish, User } from "~/types"
import { useIngredients } from "./Ingredients"

type Tree = {
  sha: string
  path: string
  url: string
}

const storage = useStorage("data")

let dishes: DishEntity[]

export async function useDishes() {
  const users = (await storage.getItem("users")) as User[]
  const { getIngredientsFromItems } = await useIngredients()

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
        const files = (await $fetch(`https://api.github.com/repos/${user.repository}/git/trees/main`)) as { tree: Tree[] }
        const newDishes = await Promise.all(
          files.tree
            .filter(file => file.path.match(/\.ya?ml$/))
            .map(async dish => await fromUrl(dish.url, dish.path, user.id))
        )
        await storage.setItem("dishes:" + user.id, newDishes)
        await dishClass.refresh()
      } catch (error) {
        if ((error as { data: { status: string }}).data.status === "404") {
          throw createError({ status: 404, message: "Unknown repository" })
        }
        throw createError({ status: 500, message: (error as Error).message })
      }
    },
  }

  async function fromUrl(url: string, path: string, userId: string) {
    const existingDishes = ((await storage.getItem("dishes:" + userId)) ?? []) as DishEntity[]
    const entry = (await $fetch(url)) as { content: string }
    const data = yaml.parse(Buffer.from(entry.content.replace(/\n/g, ""), "base64").toString("utf-8")) as RawDish
    return {
      id: existingDishes.find(dish => dish.name === data.name)?.id ?? randomUUID(),
      path,
      name: data.name,
      ingredients: getIngredientsFromItems(data.items),
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
