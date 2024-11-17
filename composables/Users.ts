import type { User } from "~/types"

const users = ref<User[] | undefined>()

export const useUsers = async () => {
  if (users.value === undefined) {
    users.value = await callApi("/api/accounts")
  }
  return {
    getAll() {
      return users
    },

    async update(id: string, user: Partial<User>) {
      const modifiedUser = (await callApi(`/api/accounts/${id}`, { method: "PUT", body: user })) as User
      users.value = users.value?.map(u => (u.id === modifiedUser.id ? modifiedUser : u))
    },
  }
}
