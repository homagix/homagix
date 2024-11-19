<script setup lang="ts">
const token = useCookie("token")
token.value = null

function gotoRecipes() {
  const router = useRouter()
  router.push("/")
}
</script>

<template>
  <h2>Ciao!</h2>
  <p>Wir hoffen, Dich bald wiederzusehen!</p>

  <div class="button-list">
    <button id="recipes-button" @click="gotoRecipes">Zu den Rezepten</button>
  </div>
</template>

<style lang="scss">
.button-list {
  margin-top: 1rem;
}
</style>
