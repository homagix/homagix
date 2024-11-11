<script setup lang="ts">
import type { UUID } from "node:crypto"
import type { DishListEntry } from "~/types"

const props = defineProps<{ ingredientName?: string; userId?: UUID }>()

const { filteredDishes } = await useDishes()

const dishes = computed(() => {
  const dishes = filteredDishes(props)
  return dishes?.map((dish, index, dishes) => {
    const nonUniqueName = dishes.some((d, i) => d.name === dish.name && index !== i)
    return { ...dish, nonUniqueName }
  })
})

function getDishName(dish: DishListEntry & { nonUniqueName?: boolean }) {
  if (dish.nonUniqueName) {
    return `${dish.name} (von ${dish.userName})`
  }
  return dish.name
}
</script>

<template>
  <ul v-if="(dishes?.length ?? 0) > 0">
    <li v-for="dish in dishes">
      <RouterLink :to="dish.url">{{ getDishName(dish) }}</RouterLink>
    </li>
  </ul>
  <div v-else class="warning">
    Keine Rezepte gefunden!
  </div>
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
.warning {
  font-size: 120%;
  margin-top: 1rem;
}
</style>
