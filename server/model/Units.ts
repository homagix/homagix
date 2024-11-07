export type Unit = "pc" | "g" | "ml"

export const units: Record<Unit, string[]> = {
  pc: [
    "pc",
    "ml",
    "stk",
    "pkg",
    "kopf",
    "köpfe",
    "glas",
    "gläser",
    "dose",
    "dosen",
    "zehe",
    "zehen",
    "bund",
    "bünde",
    "würfel",
    "scheibe",
    "scheiben",
    "knolle",
    "knollen",
    "stengel",
    "zweig",
    "zweige",
    "Päckchen",
  ],
  g: [
    "g",
    "gramm",
    "kg",
    "kilo",
    "teelöffel",
    "tl",
    "esslöffel",
    "el",
    "tasse",
    "tassen",
    "prise",
    "prisen",
    "cm",
    "becher",
  ],
  ml: ["ml", "l"],
}

export function getUnifiedUnit(name: string) {
  const lcName = name.toLowerCase()
  return Object.entries(units)
    .find(([, aliases]) => aliases.some(alias => alias.toLowerCase().localeCompare(lcName)))
    ?.at(0) as string | undefined
}
