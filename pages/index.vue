<script setup lang="ts">
const router = useRouter()
const route = useRoute()

function gotoWordCloud() {
  router.push("/ingredients-wordcloud")
}
</script>

<template>
  <div class="top-buttons">
    <AppButton @click="gotoWordCloud" id="wordcloud-button"> 🔍 </AppButton>
  </div>

  <RecipesList :ingredient="route.query.ingredient as string" />
</template>
