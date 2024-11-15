<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const user = useUser()

const onlyOwn = ref(false)

function gotoWordCloud() {
  router.push("/ingredients-wordcloud")
}

const titleAddition = computed(() => (route.query.ingredient ? `mit ${route.query.ingredient}` : ""))
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

  <label v-if="user"> <input type="checkbox" v-model="onlyOwn" /> Nur eigene Rezepte anzeigen </label>

  <RecipesList :ingredient-name="route.query.ingredient as string" :user-id="onlyOwn ? user?.id : undefined" />
</template>

<style lang="scss" scoped>
input[type="checkbox"] {
  width: auto;
}
</style>
