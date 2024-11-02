type Level = "error" | "info"

const defaultTimeout = 3000
const noTimeout = 0

const knownMessages: Record<string, string> = {
  "Invalid credentials": "Ungültige Anmeldedaten",
}

export const useMessages = () => {
  const message = ref("")
  const timer = ref()

  function set(level: Level, msg: string, timeout = defaultTimeout) {
    message.value = msg
    if (timeout !== noTimeout) {
      timer.value = setTimeout(reset, timeout)
    }
  }

  function setServerError(error: unknown) {
    const message = (error as { data: { message: string } }).data.message
    if (knownMessages[message]) {
      set("error", knownMessages[message], noTimeout)
    } else {
      set("error", "Unerwartete Antwort des Servers: " + message, noTimeout)
    }
  }

  function reset() {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = undefined
    }
    message.value = ""
  }

  function get() {
    return message
  }

  return { set, setServerError, reset, get, noTimeout }
}
