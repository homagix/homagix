<script setup lang="ts">
const router = useRouter()
const messages = useMessages()

const firstName = ref("")
const password = ref("")

const valid = computed(() => isValidPassword(password.value))

async function login() {
  try {
    const result = await $fetch("/api/sessions", {
      method: "post",
      body: { firstName: firstName.value, password: password.value },
    })
    const token = useCookie("token")
    token.value = result.token
    router.replace("/")
  } catch (error) {
    const err = await (error as { response: Response }).response.json()
    if (error === "Invalid credentials") {
      messages.set("error", "Ungültige Anmeldedaten")
    } else {
      messages.set("error", "Unerwartete Antwort des Servers: " + err, messages.noTimeout)
    }
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

    <div class="button-list">
      <span class="error">
        {{ messages.get() }}
      </span>
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
