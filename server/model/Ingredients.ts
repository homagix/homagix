import { randomUUID, UUID } from "node:crypto"
import { IngredientEntity } from "~/types"
import { getUnifiedUnit } from "./Units"

function unified(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+\(.*\)$/, "")
}

const storage = useStorage("data")
let ingredients: IngredientEntity[]
const ingredientNameMap = {} as Record<string, IngredientEntity>
let writeTimer: NodeJS.Timeout

export async function useIngredients() {
  if (ingredients === undefined) {
    ingredients = ((await storage.getItem("ingredients")) ?? []) as IngredientEntity[]
    ingredients.forEach(ingredient => (ingredientNameMap[unified(ingredient.name)] = ingredient))
  }

  return {
    getIngredients(ids: UUID[] = []) {
      if (ids.length) {
        return ingredients.filter(ingredient => ids.includes(ingredient.id))
      }
      return ingredients
    },

    getIngredientNamesFromItems(items: string[]) {
      const errors = [] as string[]
      const ingredients = items.map(item => {
        try {
          return parseItem(item)
        } catch (error) {
          errors.push((error as Error).message)
        }
      })

      if (errors.length > 0) {
        throw new Error(`The following items had errors:\n` + errors.map(m => `- ${m}`).join("\n"))
      }
      return ingredients.map(ingredient => ingredient?.name) as string[]
    },
  }

  function parseItem(item: string) {
    const [amount, unit, ...parts] = item.split(" ")
    if (!(Number(amount) > 0)) {
      throw new Error(`Amount must be a positive number in '${item}'`)
    }
    const name = parts.join(" ")

    const unifiedUnit = getUnifiedUnit(unit)
    if (!unifiedUnit) {
      throw new Error(`Unknown unit '${unit}' for '${name}' in '${item}'`)
    }

    return upsert(name, unit, unifiedUnit)
  }

  function upsert(name: string, unit: string, unifiedUnit: string) {
    const unifiedName = unified(name)
    const ingredient = ingredientNameMap[unifiedName] ?? { id: randomUUID(), name: unifiedName, units: [unifiedUnit] }

    if (!ingredient.units.includes(unit)) {
      ingredient.units.push(unit)
      setDirty()
    }
    if (!ingredientNameMap[unifiedName]) {
      ingredients.push(ingredient)
      ingredientNameMap[unifiedName] = ingredient
      setDirty()
    }

    return ingredient
  }

  async function saveIngredientList() {
    await storage.setItem(
      "ingredients",
      ingredients.sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  function setDirty(writeDelay = 1000) {
    if (writeTimer !== undefined) {
      clearTimeout(writeTimer)
    }
    writeTimer = setTimeout(saveIngredientList, writeDelay)
  }
}
