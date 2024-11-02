<script setup lang="ts">
const props = defineProps<{ ingredient?: string }>()

const router = useRouter()
const { allDishes, byIngredientName } = await useDishes()

const dishes = computed(() => {
  if (props.ingredient) {
    return byIngredientName(props.ingredient)
  }
  return allDishes()
})

const titleAddition = computed(() => (props.ingredient ? `mit ${props.ingredient}` : ""))
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
    <li v-for="dish in dishes">
      <RouterLink :to="dish.url">{{ dish.name }} (von {{ dish.user }})</RouterLink>
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
