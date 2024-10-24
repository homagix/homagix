export const useUser = async () => {
  const { data: user, refresh } = await useFetch("/api/accounts/my")

  watch(useCookie("token"), () => refresh())

  return user
}
