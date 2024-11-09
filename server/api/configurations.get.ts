import { getPublicConfiguration } from "../Configuration"

export default defineEventHandler(async () => {
  return getPublicConfiguration()
})
