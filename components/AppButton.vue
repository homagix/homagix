<script setup lang="ts">
const emit = defineEmits(["click"])
</script>

<template>
  <a @click.prevent="() => emit('click')">
    <slot />
  </a>
</template>

<style lang="scss" scoped>
a {
  display: inline-block;
  font-size: 150%;
  line-height: 1.5;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;

  &:hover {
    background: #eeeeee;
  }

  &:active {
    background: #dddddd;
  }

  &.small {
    font-size: 115%;
    line-height: 0.9;
    width: 24px;
    height: 24px;
  }
}
</style>
