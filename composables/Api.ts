import type { NitroFetchOptions } from "nitropack"

export async function callApi<T>(path: string, options?: NitroFetchOptions<string>) {
  const token = useCookie("token")
  const user = useUser()

  try {
    return (await $fetch(path, options)) as T
  } catch (error) {
    if ((error as { data: { status: number } }).data.status === 401) {
      user.value = undefined
      token.value = undefined
    }
  }
}
