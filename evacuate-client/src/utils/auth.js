const TokenKey = 'evacuate-client'

const randomString = (length, chars) => {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function getToken () {
  let token
  if (localStorage.getItem(TokenKey)) {
    token = localStorage.getItem(TokenKey)
  } else {
    token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    localStorage.setItem(TokenKey, token)
  }
  return token
}
