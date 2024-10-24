<script setup lang="ts">
const { data: user } = await useFetch("/api/accounts/my")
const emit = defineEmits(["close"])
const route = useRoute()

const sendClose = () => emit("close")
const isRootRoute = computed(() => route.path === "/")

onBeforeMount(() => window.addEventListener("click", sendClose))
onBeforeUnmount(() => window.removeEventListener("click", sendClose))
</script>

<template>
  <div class="dropdown-menu">
    <router-link v-if="!isRootRoute" to="/"> Rezepte </router-link>
    <!-- <router-link to="/favorites"> Favoriten </router-link> -->

    <hr v-if="!isRootRoute" />

    <router-link v-if="user" to="/setpwd" class="button is-light">Passwort ändern</router-link>
    <router-link v-if="user" to="/logout" class="button is-light">Abmelden</router-link>
    <router-link v-if="!user" to="/login" class="button is-light">Einloggen</router-link>
    <router-link v-if="!user" to="/register" class="button is-primary"> Registrieren </router-link>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-menu {
  position: absolute;
  right: 0;
  background: white;
  box-shadow: grey 2px 2px 5px;
  padding: 7px 12px;
  z-index: 999;

  a {
    display: block;
    text-decoration: none;
    font-size: 110%;
    color: grey;
  }
}
</style>
