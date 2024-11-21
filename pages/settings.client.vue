<script setup lang="ts">
import { isValidURL } from "~/utils/Validations"

const router = useRouter()
const { currentUser } = useCurrentUser()
const messages = useMessages()

const repository = ref(currentUser.value?.repository || "")

const valid = computed(() => repository.value === "" || isValidURL(repository.value))
const webhookURL = computed(() => `${window.origin}/api/webhooks/`)

async function save() {
  try {
    const data = await $fetch("/api/accounts", {
      method: "put",
      body: { id: currentUser.value?.id, repository: repository.value },
    })
    const token = useCookie("token")
    token.value = data.token
    router.replace("/")
  } catch (error) {
    if ((error as { data: { statusCode: number } }).data.statusCode === 404) {
      messages.set("error", "Repository konnte nicht gefunden werden!", messages.noTimeout)
    } else {
      messages.setServerError(error)
    }
  }
}

function copy2Clipboard(event: Event) {
  const el = event.target as HTMLElement
  el.style.backgroundColor = "lightgrey"
  setTimeout(() => (el.style.backgroundColor = ""), 500)
  navigator.clipboard.writeText(webhookURL.value + currentUser.value!.id)
}
</script>

<template>
  <h2 class="title">Einstellungen</h2>
  <p>Hallo {{ currentUser?.firstName }}!</p>
  <p>Hier kannst du ein GitHub Repository angeben, in dem deine eigenen Rezepte liegen.</p>

  <form @submit.prevent="save">
    <div class="fields">
      <label for="repository"> Repository-URL </label>
      <input v-model="repository" id="repository" :class="{ valid }" placeholder="Repository URL" />
    </div>
    <small v-if="!valid">Das sieht nicht nach einer gültigen URL aus</small>

    <div v-if="repository">
      <p>
        Wenn du Änderungen an deinen Rezepten direkt hier aktualisieren willst, kannst du in den Einstellungen deines
        Repositorys folgenden Webhook eintragen:
      </p>

      <div class="paste-box" @click="copy2Clipboard">
        <code>{{ webhookURL }}{{ currentUser?.id }}</code>
      </div>
    </div>

    <div class="error">{{ messages.get() }}</div>

    <div class="button-list">
      <button @click.prevent="router.back">Abbrechen</button>
      <button type="submit" :disabled="!valid">Speichern</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 600px;
  position: relative;
}

input + small {
  display: block;
}

.paste-box {
  display: flex;
  gap: 5px;
  cursor: pointer;

  &::after {
    content: "📋";
    display: inline-block;
    font-size: 120%;
  }
}

code {
  padding: 5px 10px;
  border: 1px solid grey;
  overflow: auto;
  display: block;
  white-space: nowrap;
}
</style>
