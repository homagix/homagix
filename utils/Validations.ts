export function isValidPassword(password: string) {
  return password.length >= 8
}

export function isValidURL(url: string) {
  return url?.match(/^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/) !== null
}
