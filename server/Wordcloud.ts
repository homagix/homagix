import { useDishes } from "./model/Dishes"
import { useIngredients } from "./model/Ingredients"
import { WordCloud } from "~/types"

const blackList = ["Salz", "Pfeffer", "Zucker", "Butter", "Mehl", "Öl", "Olivenöl"]

let data: WordCloud

export function useWordcloud() {
  const wordCloudClass = {
    async get() {
      if (data === undefined) {
        await wordCloudClass.refresh()
      }
      return data
    },

    async refresh() {
      const { getDishes } = await useDishes()
      const { getIngredients } = await useIngredients()
      const ingredients = Object.fromEntries(getIngredients().map(({ id, name }) => [id, name]))

      const counts = Object.entries(
        getDishes()
          .flatMap(({ ingredients }) => ingredients)
          .reduce(toIdAndCountPair, {})
      )

      data = counts
        .map(([id, count]) => ({ name: ingredients[id] ?? "", count }))
        .filter(({ name }) => !blackList.includes(name))
        .map(Object.values) as [string, number][]
    },
  }

  return wordCloudClass
}

function toIdAndCountPair(acc: Record<string, number>, { id }: { id: string }) {
  return { ...acc, [id]: (acc[id] ?? 0) + 1 }
}
