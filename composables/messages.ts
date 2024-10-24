type Level = "error" | "info"

const defaultTimeout = 3000
const noTimeout = 0

export const useMessages = () => {
  const message = ref("")
  const timer = ref()

  function set(level: Level, msg: string, timeout = defaultTimeout) {
    message.value = msg
    if (timeout !== noTimeout) {
      timer.value = setTimeout(reset, timeout)
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

  return { set, reset, get, noTimeout }
}
