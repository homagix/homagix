<script setup lang="ts">
const emit = defineEmits(["close"])

const { currentUser } = useCurrentUser()
const route = useRoute()
const config = await useConfiguration()

const sendClose = () => emit("close")
const isRootRoute = computed(() => route.path === "/")

onBeforeMount(() => window.addEventListener("click", sendClose))
onBeforeUnmount(() => window.removeEventListener("click", sendClose))

function canEditSettings() {
  return currentUser.value && currentUser.value.role !== "reader"
}

function canRegister() {
  return !currentUser.value && config.isRegistrationAllowed()
}

function isAdmin() {
  return currentUser.value?.role === "admin"
}
</script>

<template>
  <div class="dropdown-menu">
    <router-link v-if="!isRootRoute" to="/"> Rezepte </router-link>
    <!-- <router-link to="/favorites"> Favoriten </router-link> -->

    <hr v-if="!isRootRoute" />

    <router-link v-if="currentUser" to="/setpwd">Passwort ändern</router-link>
    <router-link v-if="canEditSettings()" to="/settings">Einstellungen</router-link>
    <router-link v-if="isAdmin()" to="/userlist"> Benutzerliste </router-link>

    <hr v-if="currentUser" />

    <router-link v-if="currentUser" to="/logout">Abmelden</router-link>
    <router-link v-if="!currentUser" to="/login">Einloggen</router-link>
    <router-link v-if="canRegister()" to="/register"> Registrieren </router-link>
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
