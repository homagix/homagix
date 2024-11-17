import type { PublicConfiguration } from "~/types"

const config = ref<PublicConfiguration | undefined>()
export const useConfiguration = async () => {
  if (config.value === undefined) {
    config.value = await callApi("/api/configurations")
  }
  return {
    isRegistrationAllowed: () => Boolean(config.value?.allowRegistration),
  }
}
