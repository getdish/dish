import React, { Component } from 'react'
import { Platform, View, ViewPropTypes } from 'react-native'
import StackTransitioner from './StackTransitioner'
import { SLIDE_HORIZONTAL, FADE_VERTICAL } from './animationTypes'
import styles from './styles'
// import { withRouter } from 'react-router-dom'

class Stack extends Component<{
  children: any
  history: object
  location: object
  renderHeader: Function
  renderTitle: Function
  renderLeftSegment: Function
  renderRightSegment: Function
  animationType: string
  gestureEnabled: boolean
  stackViewStyle: any
  replaceTransitionType: 'PUSH' | 'POP'
  isAnimating: Function
}> {
  static defaultProps = {
    animationType: Platform.OS === 'ios' ? SLIDE_HORIZONTAL : FADE_VERTICAL,
    gestureEnabled: true,
    isAnimating: () => null,
  }

  state = {
    width: 0,
    height: 0,
  }

  onLayout = (event) => {
    const { height, width } = event.nativeEvent.layout
    this.setState({ height, width })
  }

  render() {
    const {
      children,
      history,
      location,
      renderHeader,
      renderTitle,
      renderLeftSegment,
      renderRightSegment,
      animationType,
      gestureEnabled,
      stackViewStyle,
      replaceTransitionType,
      isAnimating,
    } = this.props

    const { height, width } = this.state

    return (
      <View style={styles.stackContainer} onLayout={this.onLayout}>
        <StackTransitioner
          history={history}
          location={location}
          height={height}
          width={width}
          renderHeader={renderHeader}
          renderTitle={renderTitle}
          renderLeftSegment={renderLeftSegment}
          renderRightSegment={renderRightSegment}
          animationType={animationType}
          gestureEnabled={gestureEnabled}
          children={children}
          stackViewStyle={stackViewStyle}
          replaceTransitionType={replaceTransitionType}
          isAnimating={isAnimating}
        />
      </View>
    )
  }
}
// export default withRouter(Stack as any)
