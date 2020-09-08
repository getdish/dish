export const initAppleSigninButton = () => {
  // @ts-ignore
  AppleID.auth.init({
    clientId: 'com.dishapp',
    scope: 'name email',
    redirectURI: 'https://dishapp.com',
    state: 'asdh8912hehaudh98qhuiasgd192h9usadas',
    usePopup: true,
  })
}
