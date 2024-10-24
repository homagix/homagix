import config from "@/config.js"

export function getJwtSecret() {
  if (!config.secrets.jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: "Missing secret.secretConfig entry in config.yaml" })
  }
  return config.secrets.jwtSecret
}
