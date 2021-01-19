import React from 'react'

// @ts-expect-error
export const createMutableSource = React.unstable_createMutableSource
// @ts-expect-error
export const useMutableSource = React.unstable_useMutableSource

export const UNWRAP_PROXY = Symbol('UNWRAP_PROXY')

export const defaultOptions = {
  once: false,
  selector: undefined,
}
