<script setup lang="ts">
import { VueShowdown } from "vue-showdown"
import type { Ingredient } from "~/types"

const router = useRouter()
const route = useRoute()
const { data: dish } = useFetch(`/api/dishes/${route.params.userId}/${route.params.dishId}`)

const description = computed(() => dish.value?.recipe || "Noch gibt es keine Beschreibung zu diesem Gericht")
const ingredients = computed(() => dish.value?.ingredients || ([] as Ingredient[]))

const mainImage = computed(() => {
  if (dish.value?.images?.length) {
    return { "background-image": "url(" + dish.value.images[0] + ")" }
  }
  return undefined
})

const additionalImages = computed(() => {
  const images = dish.value?.images
  if (images && images.length > 1) {
    return dish.value?.images?.slice(1)
  }
  return []
})
</script>

<template>
  <h2>{{ dish?.name }}</h2>

  <div class="image-and-items-wrapper">
    <div class="image-wrapper">
      <div v-if="mainImage" :style="mainImage" />
      <div v-else class="fas fa-image" />
    </div>

    <ItemList :items="ingredients" />
  </div>

  <VueShowdown
    :markdown="description"
    flavor="github"
    :options="{
      parseImgDimensions: true,
      simplifiedAutoLink: true,
      openLinksInNewWindow: true,
    }"
  />

  <img v-for="(img, index) in additionalImages" :key="index" :src="img" />

  <small v-if="dish?.source">Quelle: {{ dish.source }}</small>
  <br />
  <small v-if="dish?.userName">Eingetragen von {{ dish?.userName }}</small>

  <div class="button-list">
    <button @click="() => router.push('/')"><span class="fas fa-list"></span> Zurück</button>
  </div>
</template>

<style lang="scss" scoped>
.image-and-items-wrapper {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  margin-bottom: 0.5re;
  column-gap: 5px;
}

.image-wrapper {
  width: 100%;
  min-height: 300px;
  position: relative;

  > div {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 100px;
    background: #f5f5f5;
    color: #ddd;
    z-index: 0;
    background-size: cover;
  }
}
</style>
