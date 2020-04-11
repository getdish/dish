import React, { Component } from 'react'
import { Button } from 'react-native'

import { ZStack } from './shared/Stacks'
import { Toast } from './Toast'

export class ErrorBoundary extends Component<{
  name: string
  displayInline?: boolean
}> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught error', this.props.name)
    console.log(error.stack)
    Toast.show(`Error in component: ${this.props.name}`)
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <ZStack
          fullscreen
          alignItems="center"
          justifyContent="center"
          backgroundColor="darkred"
        >
          <Button
            title="Retry"
            onPress={() => this.setState({ error: null })}
          ></Button>
        </ZStack>
      )
    }
    return this.props.children
  }
}
