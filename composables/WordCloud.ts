import type { WordCloud } from "~/types"

const data = ref<WordCloud | undefined>(undefined)

export const useWordcloud = async () => {
  if (data.value === undefined) {
    data.value = await callApi("/api/wordclouds")
  }
  return data
}
