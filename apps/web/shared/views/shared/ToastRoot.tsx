import React, { Component } from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'

export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
}

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 999,
    alignItems: 'center',
    zIndex: 10000,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowRadius: 50,
    borderRadius: 9,
    padding: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
})

export class ToastRoot extends Component<{
  style?: any
  position?: 'top' | 'center' | 'bottom'
  textStyle?: any
  positionValue?: number
  fadeInDuration?: number
  defaultCloseDelay?: number
  fadeOutDuration?: number
  opacity?: number
}> {
  static defaultProps = {
    position: 'bottom',
    textStyle: styles.text,
    positionValue: 80,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1,
  }

  timer: any
  duration = 0
  callback = null
  animation = null
  isShow = false
  state = {
    isShow: false,
    text: '',
    opacityValue: new Animated.Value(this.props.opacity),
  }

  show = (text: string, duration: number = 1000, callback?: Function) => {
    this.duration =
      typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT
    this.callback = callback
    this.setState({
      isShow: true,
      text: text,
    })

    this.animation = Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration,
      useNativeDriver: true
    })
    this.animation.start(() => {
      this.isShow = true
      if (duration !== DURATION.FOREVER) this.close()
    })
  }

  close = (duration: number = 1000) => {
    let delay = typeof duration === 'undefined' ? this.duration : duration

    if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250

    if (!this.isShow && !this.state.isShow) return
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.animation = Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
        useNativeDriver: true
      })
      this.animation.start(() => {
        this.setState({
          isShow: false,
        })
        this.isShow = false
        if (typeof this.callback === 'function') {
          this.callback()
        }
      })
    }, delay)
  }

  componentWillUnmount() {
    this.animation && this.animation.stop()
    this.timer && clearTimeout(this.timer)
  }

  render() {
    let pos
    switch (this.props.position) {
      case 'top':
        pos = this.props.positionValue
        break
      case 'center':
        pos = height / 2
        break
      case 'bottom':
        pos = height - this.props.positionValue
        break
    }

    const view = this.state.isShow ? (
      <View style={[styles.container, { top: pos }]} pointerEvents="none">
        <Animated.View
          style={[
            styles.content,
            { opacity: this.state.opacityValue },
            this.props.style,
          ]}
        >
          {React.isValidElement(this.state.text) ? (
            this.state.text
          ) : (
            <Text style={this.props.textStyle}>{this.state.text}</Text>
          )}
        </Animated.View>
      </View>
    ) : null
    return view
  }
}
