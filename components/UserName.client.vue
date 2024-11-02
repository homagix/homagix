<script setup lang="ts">
const user = await useUser()
</script>

<template>
  <div class="username" v-if="user">{{ user.firstName }}</div>
</template>
