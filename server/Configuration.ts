import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { Configuration, PublicConfiguration } from "~/types"

export const appRoot = existsSync("config.json") ? "." : resolve(import.meta.dirname, "..", "..")
export const config = JSON.parse(readFileSync(resolve(appRoot, "config.json")).toString()) as Configuration

export function getJwtSecret() {
  if (!config.secrets.jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: "Missing secret.secretConfig entry in config.yaml" })
  }
  return config.secrets.jwtSecret
}

export function getPublicConfiguration() {
  const publicConfig = JSON.parse(JSON.stringify(config))
  delete publicConfig.secrets
  return publicConfig as PublicConfiguration
}
