import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { PressEvent } from 'react-native/Libraries/Types/CoreEventTypes'

type Props = {
  children?: any
  onTap?: (event: PressEvent) => void
  onDoubleTap?: (event: PressEvent) => void
}

const MAX_DOUBLE_TOUCH_DISTANCE = 20
const MAX_DOUBLE_TOUCH_DELAY_TIME = 250

export default class Tappable extends Component<Props> {
  timer: any
  previousPress: PressEvent

  onPress = (event: PressEvent) => {
    if (this.previousPress) {
      this.onReceiveSecondEvent(event)
    } else {
      this.onReceiveFirstEvent(event)
    }
  }

  onReceiveFirstEvent = (event: PressEvent) => {
    this.timer = setTimeout(() => {
      this.props.onTap(event)
      this.previousPress = null
    }, MAX_DOUBLE_TOUCH_DELAY_TIME)
    this.previousPress = event
  }

  onReceiveSecondEvent = (event: PressEvent) => {
    if (this.isDoubleTap(event)) {
      this.props.onDoubleTap(event)
    } else {
      this.props.onTap(event)
    }
    clearTimeout(this.timer)
    this.previousPress = null
  }

  distanceBetweenTouches = (t1: PressEvent, t2: PressEvent): number => {
    const disX = t1.nativeEvent.locationX - t2.nativeEvent.locationX
    const disY = t1.nativeEvent.locationY - t2.nativeEvent.locationY
    return Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2))
  }

  isDoubleTap = (currentEvent: PressEvent) => {
    if (!this.previousPress) {
      return false
    }

    const distance = this.distanceBetweenTouches(
      currentEvent,
      this.previousPress
    )

    const { nativeEvent } = this.previousPress
    const delay = currentEvent.nativeEvent.timestamp - nativeEvent.timestamp
    return (
      distance < MAX_DOUBLE_TOUCH_DISTANCE &&
      delay < MAX_DOUBLE_TOUCH_DELAY_TIME
    )
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}
