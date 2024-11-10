<script setup lang="ts">
import { roles, type User } from "~/types"

const props = defineProps<{ user: User }>()

const users = await useUsers()

const formData = ref({
  role: props.user.role,
})

function saveUser() {
  users.update(props.user.id, formData.value)
}
</script>

<template>
  <td>{{ user.firstName }}</td>
  <td>{{ user.repository }}</td>
  <td>
    <select v-model="formData.role" @change="saveUser">
      <option v-for="role in roles" :selected="role === user.role">{{ role }}</option>
    </select>
  </td>
</template>

<style lang="scss" scoped>
select {
  font-size: 100%;
}
</style>
