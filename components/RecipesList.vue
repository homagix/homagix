<script setup lang="ts">
const { status, data } = useFetch("/api/dishes")

const dishes = computed(() => {
  return data.value?.dishes
})
</script>

<template>
  <h2>Rezepte</h2>
  <ul v-if="status === 'success'">
    <li v-for="dish in dishes">
      <RouterLink :to="'/recipes/' + dish.id">{{ dish.name }}</RouterLink>
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
