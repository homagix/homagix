<script setup lang="ts">
import type { DishListEntry } from "~/types"

defineProps<{ dish: DishListEntry }>()

const { currentUser, setFavorite, removeFavorite } = useCurrentUser()
</script>

<template>
  <span class="fav-button" v-if="currentUser">
    <a v-if="dish.favorite === false" @click="setFavorite(dish.id)">☆</a>
    <a v-if="dish.favorite === true" @click="removeFavorite(dish.id)">★</a>
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
