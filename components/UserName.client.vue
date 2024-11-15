<script setup lang="ts">
const user = useUser()
</script>

<template>
  <div class="username" v-if="user">{{ user.firstName }}</div>
</template>
