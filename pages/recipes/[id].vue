<script setup lang="ts">
import { VueShowdown } from "vue-showdown"
import type { FullItem } from "~/types"

const basePath = "https://homagix-server.justso.de"

const router = useRouter()
const route = useRoute()
const { data: dish } = useFetch(`/api/dishes/${route.params.id}`)

const description = computed(() => dish.value?.recipe || "Noch gibt es keine Beschreibung zu diesem Gericht")
const items = computed(() => dish.value?.items as FullItem[])

const mainImage = computed(() => {
  const images = dish.value?.images
  if (images && images.length > 0) {
    return { "background-image": "url(" + getImageUrl(images[0]) + ")" }
  }
  return undefined
})

function getImageUrl(name: string) {
  return basePath + "/images/" + name
}

const additionalImages = computed(() => {
  const images = dish.value?.images
  if (images && images.length > 1) {
    return dish.value?.images.slice(1).map(i => getImageUrl(i))
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

    <ItemList :items="items" />
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

  <button @click="() => router.push('/')"><span class="fas fa-list"></span> Zurück</button>
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
