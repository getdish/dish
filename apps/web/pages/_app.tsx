import App from 'next/app'
import React from 'react'
import { createClient, Provider } from 'urql'
import 'isomorphic-unfetch'

const client = createClient({
  url: 'https://hasura-fb523da8-default.927892.on-rio.io/v1/graphql',
})

export default class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}
