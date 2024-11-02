<script setup lang="ts">
const router = useRouter()
const messages = useMessages()

const firstName = ref("")
const valid = computed(() => firstName.value !== "")

async function register() {
  try {
    const data = await $fetch("/api/accounts", { method: "post", body: { firstName: firstName.value } })
    const token = useCookie("token")
    token.value = data.token
    router.replace("/setpwd")
  } catch (error) {
    messages.setServerError(error)
  }
}
</script>

<template>
  <form @submit="register">
    <h2 class="title">Neu registrieren</h2>
    <p>
      Hier kannst du deinem Zugang einen Namen (z.B. deinen Vornamen oder auch einen Phantasienamen) geben. Wir sprechen
      dich dann künftig damit an.
    </p>

    <div class="fields">
      <label>
        Name
        <input v-model="firstName" type="text" required :class="{ valid }" />
      </label>
    </div>

    <div class="error">{{ messages.get() }}</div>

    <div class="button-list">
      <button @click="router.back">Abbrechen</button>
      <button type="submit">Registrieren</button>
    </div>
  </form>
</template>
