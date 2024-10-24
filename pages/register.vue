<script setup lang="ts">
const router = useRouter()

let firstName = ref("")

async function register() {
  const { data } = await useFetch("/api/accounts", { method: "post", body: { firstName: firstName.value } })
  if (data.value?.token) {
    const token = useCookie("token")
    token.value = data.value.token
    router.replace("/setpwd")
  } else {
    console.error(data)
    throw new Error("The register function returned an unexpected result")
  }
}

function cancel() {
  router.back()
}
</script>

<template>
  <h2 class="title is-4">Neu registrieren</h2>
  <p>
    Hier kannst du deinem Zugang einen Namen (z.B. deinen Vornamen oder auch einen Phantasienamen) geben. Wir sprechen
    dich dann künftig damit an.
  </p>
  <label>
    Name
    <input v-model="firstName" type="text" />
  </label>

  <div class="button-list">
    <button id="cancel-button" @click="cancel">Abbrechen</button>
    <button id="register-button" @click="register">Registrieren</button>
  </div>
</template>

<style lang="scss"></style>
