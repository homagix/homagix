<script setup lang="ts">
import type { DishListEntry } from "~/types"

const router = useRouter()
const route = useRoute()
const {currentUser} = useCurrentUser()

function gotoWordCloud() {
  router.push("/ingredients-wordcloud")
}

const titleAddition = computed(() => (route.query.ingredient ? `mit ${route.query.ingredient}` : ""))

type DishFilter = (dish: DishListEntry) => boolean
type Tab = { id: string; label: string; filter: DishFilter }

function includesSelectedIngredient(dish: DishListEntry) {
  const ingredient = (route.query.ingredient as string)?.toLowerCase()
  if (!ingredient) {
    return true
  }
  return dish.ingredientNames.includes(ingredient)
}

const tabs: Tab[] = [
  { id: "all", label: "Alle", filter: includesSelectedIngredient },
  { id: "fav", label: "Favoriten", filter: dish => dish.favorite === true && includesSelectedIngredient(dish) },
  { id: "my", label: "Eigene", filter: dish => dish.userId === currentUser.value?.id && includesSelectedIngredient(dish) },
]

const selectedTab = ref(tabs[0])
</script>

<template>
  <div class="top-buttons">
    <AppButton @click="gotoWordCloud" id="wordcloud-button"> 🔍 </AppButton>
  </div>

  <h2>
    Rezepte
    {{ titleAddition }}
    <sup>
      <AppButton v-if="route.query.ingredient" @click="() => router.push('/')" class="small"> × </AppButton>
    </sup>
  </h2>

  <AppTabs v-if="currentUser" :tabs="tabs" labelField="label" v-model="selectedTab" />

  <RecipesList :ingredient-name="route.query.ingredient as string" :filter="selectedTab.filter" />
</template>

<style lang="scss" scoped>
input[type="checkbox"] {
  width: auto;
}
</style>
