import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const appRoot = existsSync("config.json") ? "." : resolve(import.meta.dirname, "..", "..")
const config = JSON.parse(readFileSync(resolve(appRoot, "config.json")).toString())

export function getJwtSecret() {
  if (!config.secrets.jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: "Missing secret.secretConfig entry in config.yaml" })
  }
  return config.secrets.jwtSecret
}
