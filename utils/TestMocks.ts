let cookie: unknown

export function useMockedCookie() {
  return {
    get value() {
      return cookie
    },
    set value(val: unknown) {
      cookie = val
    },
  }
}
