export const initAppleSigninButton = () => {
  // supports multiple sign in buttons
  const existingInited = document.querySelector('#appleid-signin > div')
  if (existingInited) {
    document.querySelector('#appleid-signin')?.removeAttribute('id')
  }
  // @ts-ignore
  AppleID.auth.init({
    clientId: 'com.dishapp',
    scope: 'name email',
    redirectURI: 'https://auth.dishapp.com/apple_authorize',
    state: 'asdh8912hehaudh98qhuiasgd192h9usadas',
    usePopup: true,
  })
}
