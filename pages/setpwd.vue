<script setup lang="ts">
const router = useRouter()
const { currentUser } = useCurrentUser()
const messages = useMessages()

if (!currentUser.value) {
  router.replace("/")
}

const newPassword = computed(() => !currentUser.value?.passwordSet)
const currentPassword = ref("")
const password = ref("")

const valid = computed(() => isValidPassword(password.value))

async function setPwd() {
  try {
    const data = await $fetch("/api/accounts", {
      method: "put",
      body: { id: currentUser.value?.id, password: password.value, currentPassword: currentPassword.value },
    })
    const token = useCookie("token")
    token.value = data.token
    router.replace("/")
  } catch (error) {
    messages.setServerError(error)
  }
}
</script>

<template>
  <h2 class="title">Passwort {{ newPassword ? "setzen" : "ändern" }}</h2>
  <p>Hallo {{ currentUser?.firstName }}!</p>
  <p>Gib' ein Passwort an, mit dem du dich künftig einloggen willst.</p>

  <form @submit.prevent="setPwd">
    <div class="fields">
      <label v-if="currentUser?.passwordSet" for="setpwd-current"> Bisheriges Passwort </label>
      <input
        v-if="currentUser?.passwordSet"
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
      <button v-if="currentUser?.passwordSet" @click.prevent="router.back">Abbrechen</button>
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
