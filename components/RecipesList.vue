<script setup lang="ts">
import type { DishListEntry } from "~/types"

const props = defineProps<{ ingredient?: string }>()

const router = useRouter()
const { allDishes, byIngredientName } = await useDishes()

const dishes = computed(() => {
  const dishes = props.ingredient ? byIngredientName(props.ingredient) : allDishes()
  return dishes?.map(enrichWithSource)
})

const titleAddition = computed(() => (props.ingredient ? `mit ${props.ingredient}` : ""))

function enrichWithSource(dish: DishListEntry, index: number, dishes: DishListEntry[]) {
  const nonUniqueName = dishes.some((d, i) => d.name === dish.name && index !== i)
  return { ...dish, nonUniqueName }
}

function getDishName(dish: DishListEntry & { nonUniqueName?: boolean }) {
  if (dish.nonUniqueName) {
    return `${dish.name} (von ${dish.userName})`
  }
  return dish.name
}
</script>

<template>
  <h2>
    Rezepte
    {{ titleAddition }}
    <sup>
      <AppButton v-if="ingredient" @click="() => router.push('/')" class="small"> × </AppButton>
    </sup>
  </h2>

  <ul v-if="dishes">
    <li v-for="dish in dishes.map(enrichWithSource)">
      <RouterLink :to="dish.url">{{ getDishName(dish) }}</RouterLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  font-size: 120%;
}
li {
  list-style: "🍲";
  padding-left: 10px;
}
a {
  text-decoration: none;
  color: #333333;
}
</style>
