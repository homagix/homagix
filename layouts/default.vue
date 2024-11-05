<script setup lang="ts">
import { ref } from "vue"

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation" @click="closeMenu">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <h1 class="title">Homagix</h1>
      </router-link>
    </div>

    <UserName />

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click.stop="toggleMenu"> ☰ </a>
  </nav>
  <DropdownMenu v-if="menuOpen" @close="closeMenu" />

  <NuxtLoadingIndicator />

  <main>
    <slot />
  </main>
</template>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  background: #f78e00;
  color: white;
  padding: 5px 10px;
  box-shadow: grey 0 0 5px;

  &.is-active .navbar-item {
    color: #000000 !important;
  }
}

h1.title {
  font-weight: normal;
  color: #ffff00;
  position: relative;
  float: left;
  font-size: 2rem;
  margin: 0;
  padding: 0 5px 0 0;

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 1.5px;
    top: 6px;
    width: 0.5em;
    height: 0.5em;
    border: 0.15em none #ffff00;
    border-top-style: solid;
    border-left-style: solid;
    transform: scaleY(0.66) rotate(45deg);
  }
}

.username {
  font-size: 120%;
  flex-grow: 1;
  text-align: right;
  padding-right: 5px;
  line-height: 3rem;

  @media screen and (min-width: 1024px) {
    line-height: 3rem;
  }
}

.navbar-burger {
  font-size: 32px;
  position: relative;
  top: -3px;
  cursor: pointer;
  user-select: none;
}

main {
  max-width: 800px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1rem 0.7rem;
}
</style>
