<script setup lang="ts">
import type { Ingredient } from "~/types"

defineProps<{ items: Ingredient[] }>()
</script>

<template>
  <div class="box">
    <p class="title">Zutaten:</p>
    <div class="item-list">
      <template v-for="(item, index) in items" :key="index">
        <span class="amount">{{ item.amount }}</span>
        <span>{{ item.unit }}</span>
        <span>{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  border: 1px solid #888;
  padding: 3px;
}
.title {
  margin-top: 0;
  font-weight: bold;
}
.item-list {
  display: inline-grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr 6fr;
  gap: 2px 5px;
  align-content: flex-start;
  min-height: 300px;
  min-width: 200px;

  .amount {
    text-align: right;
  }
}
</style>
