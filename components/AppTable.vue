<script setup lang="ts">
defineProps<{
  list: unknown[]
  columnNames: string[]
}>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="name in columnNames">{{ name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in list">
        <slot :entry="entry" />
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  border: 1px solid lightgrey;
  border-collapse: collapse;

  thead th {
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background-color: #fee0b9;
  }

  :deep(td), th {
    padding: 3px 6px;
  }
}
</style>
