<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
const token = useCookie("token")
token.value = null
</script>

<template>
  <h2 class="title is-4">Ciao!</h2>
  <p>Wir hoffen, Dich bald wiederzusehen!</p>

  <div class="button-list">
    <button id="recipes-button" @click="router.push('/')">Zu den Rezepten</button>
  </div>
</template>

<style lang="scss">
.button-list {
  margin-top: 1rem;
}
</style>
