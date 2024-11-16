<script setup lang="ts">
import type { DishListEntry } from "~/types"

const props = defineProps<{
  filter: (dish: DishListEntry) => boolean
}>()

const { allDishes } = await useDishes()

const dishes = computed(() => {
  return allDishes()
    ?.filter(props.filter)
    ?.map((dish, index, dishes) => {
      const nonUniqueName = dishes.some((d, i) => d.name === dish.name && index !== i)
      const name = dish.name + (nonUniqueName ? ` (von ${dish.userName})` : "")
      return { ...dish, name }
    })
})
</script>

<template>
  <ul v-if="(dishes?.length ?? 0) > 0">
    <li v-for="dish in dishes">
      <RouterLink :to="`/recipes/${dish.userId}/${dish.id}`">{{ dish.name }}</RouterLink>
      <FavoriteButton :dish="dish" />
    </li>
  </ul>
  <div v-else class="warning">Keine Rezepte gefunden!</div>
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
