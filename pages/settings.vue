<script setup lang="ts">
import { isValidURL } from "~/utils/Validations"

const router = useRouter()
const user = await useUser()
const messages = useMessages()

const repository = ref(user.value?.repository || "")

const valid = computed(() => repository.value === "" || isValidURL(repository.value))

type ApiError = { data: { message: string } }

async function save() {
  try {
    const data = await $fetch("/api/accounts", {
      method: "put",
      body: { id: user.value?.id, repository: repository.value },
    })
    if (data.token) {
      const token = useCookie("token")
      token.value = data.token
      router.replace("/")
    } else {
      messages.set("error", "Unerwartete Antwort des Servers: " + JSON.stringify(data), messages.noTimeout)
    }
  } catch (error) {
    messages.set("error", "Unerwartete Antwort des Servers: " + (error as ApiError).data.message, messages.noTimeout)
  }
}
</script>

<template>
  <h2 class="title">Einstellungen</h2>
  <p>Hallo {{ user?.firstName }}!</p>
  <p>Hier kannst du ein GitHub Repository angeben, in dem deine eigenen Rezepte liegen.</p>

  <form @submit.prevent="save">
    <div class="fields">
      <label for="repository"> Repository-URL </label>
      <input v-model="repository" id="repository" :class="{ valid }" placeholder="Repository URL" />
    </div>
    <small v-if="!valid">Das sieht nicht nach einer gültigen URL aus</small>

    <div class="button-list">
      <span class="error">
        {{ messages.get() }}
      </span>
      <button @click="router.back">Abbrechen</button>
      <button type="submit" :disabled="!valid">Speichern</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 600px;
}

input + small {
  display: block;
}
</style>
