import { parse } from "yaml"
import { readFileSync } from "node:fs"

export type Unit = "pc" | "g" | "ml"

export const units = Object.entries(parse(readFileSync("units.yaml").toString())).reduce((acc, [alias, definition]) => {
  const [amount, unit] = (definition as string).split(" ") as [number, Unit]
  acc[unit] = (acc[unit] ?? []).concat(alias)
  return acc
}, {} as Record<Unit, string[]>)

export function getUnifiedUnit(name: string) {
  const lcName = name.toLowerCase()
  return Object.entries(units)
    .find(([, aliases]) => aliases.some(alias => alias.toLowerCase().localeCompare(lcName)))
    ?.at(0) as string | undefined
}
