<script setup lang="ts">
const router = useRouter()
const messages = useMessages()
const { isRegistrationAllowed } = await useConfiguration()

const firstName = ref("")
const valid = computed(() => firstName.value !== "")

async function register() {
  if (isRegistrationAllowed()) {
    try {
      const data = await $fetch("/api/accounts", { method: "post", body: { firstName: firstName.value } })
      const token = useCookie("token")
      token.value = data.token
      router.replace("/setpwd")
    } catch (error) {
      messages.setServerError(error)
    }
  }
}
</script>

<template>
  <form @submit.prevent="register">
    <h2 class="title">Neu registrieren</h2>

    <div v-if="!isRegistrationAllowed()" class="box error">
      <p>Aktuell ist keine Neuregistrierung möglich!</p>
      <p>Der Administrator hat diese Funktion ausgeschaltet.</p>
    </div>

    <template v-else>
      <p>
        Hier kannst du deinem Zugang einen Namen (z.B. deinen Vornamen oder auch einen Phantasienamen) geben. Wir
        sprechen dich dann künftig damit an.
      </p>

      <div class="fields">
        <label>
          Name
          <input v-model="firstName" type="text" required :class="{ valid }" />
        </label>
      </div>

      <div class="error">{{ messages.get() }}</div>
    </template>

    <div class="button-list">
      <button @click.prevent="router.back">Abbrechen</button>
      <button v-if="isRegistrationAllowed()" type="submit">Registrieren</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.box {
  border: 2px solid red;
  border-radius: 6px;
  padding: 0 1rem;
}
</style>
