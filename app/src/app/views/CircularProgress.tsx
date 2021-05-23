import React from 'react'
import { Animated, View } from 'react-native'
import { G, Linecap, Path, Svg } from 'react-native-svg'

type CircularProgressProps = {
  fill: number
  width: number
  size: number // | Animated.Value
  style?: Object
  backgroundWidth?: number
  tintColor?: string
  tintTransparency?: boolean
  backgroundColor?: string
  rotation?: number
  lineCap?: Linecap
  arcSweepAngle?: number
  children?: any
  childrenContainerStyle?: any
  padding?: number
  renderCap?: (x: any) => any
  dashedBackground?: { width: number; gap: number }
  dashedTint?: { width: number; gap: number }
  fillLineCap?: any
}

export function CircularProgress({
  size,
  width,
  backgroundWidth,
  tintColor = 'black',
  tintTransparency = true,
  backgroundColor,
  style,
  rotation = 90,
  lineCap = 'butt',
  fillLineCap = lineCap,
  arcSweepAngle = 360,
  fill,
  children,
  childrenContainerStyle,
  padding = 0,
  renderCap,
  dashedBackground = { width: 0, gap: 0 },
  dashedTint = { width: 0, gap: 0 },
}: CircularProgressProps) {
  const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width
  const sizeWithPadding = size / 2 + padding / 2
  const radius = size / 2 - maxWidthCircle / 2 - padding / 2

  const currentFillAngle = (arcSweepAngle * clampFill(fill)) / 100
  const backgroundPath = getCirclePath(
    sizeWithPadding,
    sizeWithPadding,
    radius,
    tintTransparency ? 0 : currentFillAngle,
    arcSweepAngle
  )
  const circlePath = getCirclePath(sizeWithPadding, sizeWithPadding, radius, 0, currentFillAngle)
  const coordinate = polarToCartesian(sizeWithPadding, sizeWithPadding, radius, currentFillAngle)
  const cap = renderCap?.({ center: coordinate }) ?? null
  const offset = size - maxWidthCircle * 2

  const localChildrenContainerStyle = {
    position: 'absolute',
    left: width,
    top: width,
    width: offset - padding,
    height: offset - padding,
    borderRadius: offset / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...childrenContainerStyle,
  }

  const strokeDasharrayTint =
    dashedTint.gap > 0 ? Object.values(dashedTint).map((value) => parseInt(String(value))) : null

  const strokeDasharrayBackground =
    dashedBackground.gap > 0
      ? Object.values(dashedBackground).map((value) => parseInt(String(value)))
      : null

  return (
    <View style={style}>
      <Svg width={size + padding} height={size + padding}>
        <G rotation={rotation} originX={(size + padding) / 2} originY={(size + padding) / 2}>
          {backgroundColor && (
            <Path
              d={backgroundPath}
              stroke={backgroundColor}
              strokeWidth={backgroundWidth || width}
              strokeLinecap={lineCap}
              strokeDasharray={strokeDasharrayBackground ?? ''}
              fill="transparent"
            />
          )}
          {fill > 0 && (
            <Path
              d={circlePath}
              stroke={tintColor}
              strokeWidth={width}
              strokeLinecap={fillLineCap}
              strokeDasharray={strokeDasharrayTint ?? ''}
              fill="transparent"
            />
          )}
          {cap}
        </G>
      </Svg>
      {!!children && <View style={localChildrenContainerStyle}>{children}</View>}
    </View>
  )
}

const clampFill = (fill) => Math.min(100, Math.max(0, fill))

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function getCirclePath(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle * 0.9999)
  var end = polarToCartesian(x, y, radius, startAngle)
  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y]
  return d.join(' ')
}
