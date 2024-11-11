import { useDishes } from "../../model/Dishes"
import { useUsers } from "../../model/Users"
import type { UUID } from "node:crypto"

type HookPayload = {
  action: "push"
  ref: string
  repository: {
    full_name: string
  }
}

export default defineEventHandler(async event => {
  const { updateDishesFromRepository } = await useDishes()
  const { getByRepository } = await useUsers()
  const id = getRouterParam(event, "id") as UUID

  const body = (await readBody(event)) as HookPayload
  if (body.action === "push" && body.ref === "refs/heads/main") {
    const repository = body.repository

    const user = getByRepository(repository.full_name)
    if (!user) {
      throw createError({ statusCode: 400, message: "Unknown repository" })
    }
    if (user.id !== id) {
      throw createError({ statusCode: 400, message: "Invalid webhook call" })
    }

    await updateDishesFromRepository(user)
  }
})
