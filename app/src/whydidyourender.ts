// helpful tool to improve/debug performance
// just uncomment this and look at logs

import React from 'react'

if (process.env.NODE_ENV === 'development') {
  console.log('loading whydidyourender')
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    // include: [/HomePage/],
  })
}
