<script setup lang="ts">
const { currentUser } = useCurrentUser()
</script>

<template>
  <div class="username" v-if="currentUser">{{ currentUser.firstName }}</div>
</template>
