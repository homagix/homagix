<script setup lang="ts">
const router = useRouter()
const user = await useUser()
const messages = useMessages()

if (!user.value) {
  router.replace("/")
}

const newPassword = computed(() => !user.value?.passwordSet)
const currentPassword = ref("")
const password = ref("")

const valid = computed(() => isValidPassword(password.value))

async function setPwd() {
  const { data, error } = await useFetch("/api/accounts", {
    method: "put",
    body: { id: user.value?.id, password: password.value, currentPassword: currentPassword.value },
  })
  if (data.value?.token) {
    const token = useCookie("token")
    token.value = data.value.token
    router.replace("/")
  } else {
    messages.set("error", "Unerwartete Antwort des Servers: " + error.value?.data.message, messages.noTimeout)
  }
}
</script>

<template>
  <h2 class="title">Passwort {{ newPassword ? "setzen" : "ändern" }}</h2>
  <p>Hallo {{ user?.firstName }}!</p>
  <p>Gib' ein Passwort an, mit dem du dich künftig einloggen willst.</p>

  <form @submit.prevent="setPwd">
    <div class="fields">
      <label v-if="user?.passwordSet" for="setpwd-current"> Bisheriges Passwort </label>
      <input
        v-if="user?.passwordSet"
        v-model="currentPassword"
        id="setpwd-current"
        type="password"
        :class="{ valid: isValidPassword(currentPassword) }"
        placeholder="Bisheriges Passwort"
      />

      <label for="setpwd-password"> Neues Passwort </label>
      <input v-model="password" id="setpwd-password" type="password" :class="{ valid }" placeholder="Neues Passwort" />
    </div>
    <small v-if="!valid">Das Passwort soll mindestens 8 Zeichen enthalten</small>

    <div class="error">{{ messages.get() }}</div>

    <div class="button-list">
      <button @click="router.back">Abbrechen</button>
      <button type="submit" :disabled="!valid">Passwort setzen</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 400px;
}

input + small {
  display: block;
}
</style>
