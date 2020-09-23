import React from 'react'

import { isWeb } from '../constants'

export function Form(props: any) {
  if (isWeb) {
    return <form {...props} />
  }
  return <>{props.children}</>
}
