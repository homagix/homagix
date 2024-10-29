export const useUser = async () => {
  const token = useCookie("token")
  const { data, refresh } = await useFetch("/api/accounts/my")

  watch(token, () => refresh())

  return data
}
