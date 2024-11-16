<script setup lang="ts">
type Tab = { id: string } & Record<string, unknown>

defineProps<{
  tabs: Tab[]
  labelField: string
}>()

const selected = defineModel<Tab>()
</script>

<template>
  <span class="tabs">
    <a v-for="tab in tabs" @click="selected = tab" :class="{ selected: tab.id === selected?.id }">{{
      tab[labelField]
    }}</a>
  </span>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 1rem;

  a {
    padding: 10px 15px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    border: none;
    background-color: #f9f9f9;
    color: #333;
    font-size: 16px;
    border-bottom: 2px solid transparent;
    transition: background-color 0.3s, border-bottom 0.3s;

    &:hover {
      background-color: #eaeaea;
    }

    &.selected {
      border-bottom: 2px solid #f78e00;
      color: #f78e00;
      background-color: #fff;
    }
  }
}
</style>
