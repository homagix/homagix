import { parse } from "yaml"

export type Unit = "pc" | "g" | "ml"

const storage = useStorage("assets:server")

const unitsFileContent = (await storage.getItem("units.yaml")) as string

export const units = Object.entries(parse(unitsFileContent)).reduce((acc, [alias, definition]) => {
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
