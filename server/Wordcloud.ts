import { useDishes } from "./model/Dishes"
import { WordCloud } from "~/types"

const blackList = [
  "Salz",
  "Pfeffer",
  "Zucker",
  "Butter",
  "Mehl",
  "Öl",
  "Olivenöl",
  "Zwiebeln",
  "Knoblauch",
  "Tomaten",
  "Backpulver",
  "Fenchel",
  "Kräuter",
  "Bratfett",
  "milch",
  "dill",
  "essig",
  "kerbel"
].map(name => name.toLowerCase())

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

      const counts = countOccurrences(getDishes().flatMap(({ ingredients }) => ingredients))

      data = Object.entries(counts).filter(([name]) => !blackList.includes(name))
    },
  }

  return wordCloudClass
}

type CountMap = Record<string, number>

function countOccurrences(list: string[]) {
  return list.reduce((acc: CountMap, entry: string) => ({ ...acc, [entry]: (acc[entry] ?? 0) + 1 }), {})
}
