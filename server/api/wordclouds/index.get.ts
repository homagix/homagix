import { useWordcloud } from "~/server/Wordcloud"

const wordCloud = useWordcloud()

export default defineEventHandler(async () => {
  return await wordCloud.get()
})
