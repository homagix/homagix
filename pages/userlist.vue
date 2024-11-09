<script setup lang="ts">
const users = await useUsers()
const router = useRouter()
</script>

<template>
  <h2>Benutzerliste</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Rolle</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users">
        <td>{{ user.firstName }}</td>
        <td>{{ user.role }}</td>
      </tr>
    </tbody>
  </table>

  <div class="button-list">
    <button @click.prevent="router.push('/')">Zurück</button>
  </div>
</template>

<style lang="scss" scoped>
table {
  background: grey;

  th {
    color: #eeeeee;
  }

  td {
    background: white;
    padding: 3px 6px;
  }
}
</style>
