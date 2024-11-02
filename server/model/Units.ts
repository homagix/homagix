export const units = ["pc", "g", "ml"] as const
export type Unit = (typeof units)[number]

export const unitAliases: Record<string, Unit> = {
  pc: "pc",
  g: "g",
  ml: "ml",
  stk: "pc",
  pkg: "pc",
  gramm: "g",
  kg: "g",
  kilo: "g",
  l: "ml",
  kopf: "pc",
  köpfe: "pc",
  glas: "pc",
  gläser: "pc",
  dose: "pc",
  dosen: "pc",
  zehe: "pc",
  zehen: "pc",
  bund: "pc",
  bünde: "pc",
  würfel: "pc",
  teelöffel: "g",
  tl: "g",
  esslöffel: "g",
  el: "g",
  scheibe: "pc",
  scheiben: "pc",
  knolle: "pc",
  knollen: "pc",
}