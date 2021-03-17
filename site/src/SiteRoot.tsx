// //!
// import { ProvideUI, View, Stack } from '@o/ui'
// //
// const React = require('react')
// const { themes } = require('./themes')
// const height = eval(`1`)
// export const SiteRoot = () => {
//   return (
//     <ProvideUI themes={themes} activeTheme="dark">
//       <Stack direction="horizontal" />
//       <View
//         height={height}
//         onClick={() => {}}
//         flexDirection="row"
//         alignItems="center"
//         position="relative"
//         justifyContent="center"
//       />
//     </ProvideUI>
//   )
// }
import { ErrorBoundary, ProvideBanner, ProvideUI } from '@o/ui'
import React, { StrictMode, Suspense } from 'react'
import { Router, View } from 'react-navi'

import { Layout } from './Layout'
import { Navigation } from './Navigation'
import { SiteStoreContext } from './SiteStore'
import { themes } from './themes'

export const SiteRoot = () => {
  return (
    <ProvideUI themes={themes} activeTheme="home">
      <ProvideBanner>
        <ErrorBoundary name="Site Root">
          <SiteStoreContext.Provider>
            {/* this key helps HMR for lazy imports... but it breaks scroll position */}
            <Router
              // key={process.env.NODE_ENV === 'development' ? Math.random() : 0}
              navigation={Navigation}
            >
              <Layout>
                <Suspense fallback={null}>
                  <View hashScrollBehavior="smooth" />
                </Suspense>
              </Layout>
            </Router>
          </SiteStoreContext.Provider>
        </ErrorBoundary>
      </ProvideBanner>
    </ProvideUI>
  )
}
