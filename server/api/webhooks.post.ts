import yaml from "yaml"
import { randomUUID } from "node:crypto"
import type { DishReference, RawDish, User } from "~/types"

type HookPayload = {
  action: "push"
  ref: string
  repository: {
    full_name: string
  }
}

type Tree = {
  sha: string
  path: string
  url: string
}

const storage = useStorage("data")

export default defineEventHandler(async event => {
  const body = (await readBody(event)) as HookPayload
  if (body.action === "push" && body.ref === "refs/heads/main") {
    const repository = body.repository

    const users = ((await storage.getItem("users")) || []) as User[]
    const user = users.find(user => user.repository === repository.full_name)
    if (!user) {
      throw createError({ statusCode: 400, message: "Unknown repository" })
    }

    const dishes = ((await storage.getItem("dishes:" + user.id)) ?? []) as DishReference[]
    const files = (await $fetch(`https://api.github.com/repos/${user.repository}/git/trees/main`)) as { tree: Tree[] }
    const newDishes = await Promise.all(
      files.tree.filter(file => file.path.match(/\.ya?ml$/)).map(toDishReference(dishes))
    )
    await storage.setItem("dishes:" + user.id, newDishes)
  }
})

function toDishReference(existingDishes: DishReference[]) {
  return async (dish: Tree) => {
    const entry = (await $fetch(dish.url)) as { content: string }
    const { name } = yaml.parse(Buffer.from(entry.content.replace(/\n/g, ""), "base64").toString("binary")) as RawDish
    const id = existingDishes.find(dish => dish.name === name)?.id ?? randomUUID()
    return { id, path: dish.path, name } as DishReference
  }
}
