<script setup lang="ts">
import type { User } from "~/types"

const users = await useUsers()
const router = useRouter()
const { assertRole } = useCurrentUser()

if (!assertRole("admin")) {
  router.replace("/")
}

const allUsers = users.getAll().value || []
</script>

<template>
  <h2>Benutzerliste</h2>

  <AppTable :list="allUsers" :column-names="['Name', 'Repository', 'Rolle']">
    <template v-slot="{ entry: user }">
      <UserListEntry :user="user as User" />
    </template>
  </AppTable>

  <div class="button-list">
    <button @click.prevent="router.push('/')">Zurück</button>
  </div>
</template>
