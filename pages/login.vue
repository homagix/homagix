<script setup lang="ts">
const router = useRouter()
const messages = useMessages()
const token = useCookie("token")

const firstName = ref("")
const password = ref("")

const valid = computed(() => isValidPassword(password.value))

async function login() {
  try {
    token.value = undefined
    const result = await $fetch("/api/sessions", {
      method: "post",
      body: { firstName: firstName.value, password: password.value },
    })
    token.value = result.token
    router.replace("/")
  } catch (error) {
    messages.setServerError(error)
  }
}
</script>

<template>
  <h2 class="title is-4">Willkommen!</h2>
  <p>Du bist bereits registriert? Gib' bitte deinen Vornamen und dein Passwort an:</p>

  <form @submit.prevent="login">
    <div class="fields">
      <label for="login-firstname"> Vorname </label>
      <input id="login-firstname" v-model="firstName" type="text" placeholder="Vorname" @keypress="messages.reset" />

      <label for="login-password"> Passwort </label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        :class="{ valid }"
        placeholder="Passwort"
        @keypress="messages.reset"
      />
    </div>

    <div class="error">{{ messages.get() }}</div>

    <div class="button-list">
      <button type="submit" :disabled="!valid">Einloggen</button>
    </div>
  </form>

  <p>Du willst dich neu registrieren? Dann geht's <router-link to="/register">hier entlang</router-link></p>
</template>

<style lang="scss" scoped>
form {
  max-width: 400px;
}
</style>
