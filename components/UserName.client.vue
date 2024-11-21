<script setup lang="ts">
const { currentUser } = useCurrentUser()
</script>

<template>
  <span class="username" v-if="currentUser">{{ currentUser.firstName }}</span>
</template>
