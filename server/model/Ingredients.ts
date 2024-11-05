import { randomUUID, UUID } from "node:crypto"
import { unitAliases } from "./Units"
import { IngredientEntity, RawDish } from "~/types"

function unified(str: string) {
  return str.trim().toLowerCase()
}

function unique(arr: string[]) {
  return [...new Set(arr)]
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

    getIngredientsFromItems(items: string[]) {
      const errors = [] as string[]
      const ingredients = items.map(item => {
        const [amount, unit, ...parts] = item.split(" ")
        if (!(Number(amount) > 0)) {
          errors.push(`Amount must be a positive number in '${item}'`)
        }
        const name = parts.join(" ")
        const unifiedUnit = unitAliases[unit.toLowerCase()]
        if (!unifiedUnit) {
          errors.push(`Unknown unit '${unit}' for '${name}'in '${item}'`)
        }
        const ingredient = ingredientNameMap[unified(name)]
        if (ingredient) {
          addIngredientUnit(ingredient, unit)
        } else {
          addIngredient({ id: randomUUID(), name, units: unique([unifiedUnit, unit]) })
        }
        const id = ingredientNameMap[unified(name)].id
        return { amount: Number(amount), unit, id }
      })

      if (errors.length > 0) {
        throw new Error(`The following items had errors:\n` + errors.map(m => `- ${m}`).join("\n"))
      }
      return ingredients
    },
  }

  async function saveIngredientList() {
    await storage.setItem("ingredients", ingredients)
  }

  function setDirty(writeDelay = 1000) {
    if (writeTimer !== undefined) {
      clearTimeout(writeTimer)
    }
    writeTimer = setTimeout(saveIngredientList, writeDelay)
  }

  async function addIngredient(ingredient: IngredientEntity) {
    ingredients.push(ingredient)
    ingredientNameMap[unified(ingredient.name)] = ingredient
    setDirty()
  }

  async function addIngredientUnit(ingredient: IngredientEntity, unit: string) {
    if (!ingredient.units.includes(unit)) {
      ingredient.units.push(unit)
      setDirty()
    }
  }
}
