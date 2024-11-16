<script setup lang="ts">
import type { DishListEntry } from "~/types";

defineProps<{ dish: DishListEntry }>()

const favorites = await useFavorites()
const user = useUser()

const isMounted = computed(() => user.value !== undefined)
</script>

<template>
  <span class="fav-button" v-if="isMounted">
    <a v-if="dish.favorite === false" @click="favorites.set(dish.id)">☆</a>
    <a v-if="dish.favorite === true" @click="favorites.remove(dish.id)">★</a>
  </span>
</template>

<style lang="scss" scoped>
.fav-button {
  margin-left: 0.5rem;
  cursor: pointer;

  a:hover {
    color: grey;
  }
}
</style>
