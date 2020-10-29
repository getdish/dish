import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { memo, useState } from 'react'
import {
  AbsoluteVStack,
  ProgressCircle,
  StackProps,
  Text,
  Tooltip,
  VStack,
  prevent,
} from 'snackui'

import {
  bgLight,
  darkGreen,
  darkRed,
  green,
  lightGreen,
  lightRed,
  orange,
  red,
} from '../colors'
import { useIsNarrow } from '../hooks/useIs'
import CircularProgress from './CircularProgress'

export const UpvoteDownvoteScore = memo(
  ({
    score,
    ratio,
    vote,
    subtle,
    setVote,
    size,
    ...props
  }: {
    size?: 'sm' | 'md'
    ratio?: number
    score: number
    vote: -1 | 0 | 1
    setVote?: (vote: number) => void
    subtle?: boolean
  } & StackProps) => {
    score = Math.round(score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.75 : 1
    const sizePx = 56 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }

    const upvote = (
      <VoteButton
        size={18 * scale}
        Icon={ChevronUp}
        voted={vote == 1}
        color={vote === 1 ? 'green' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote === 1 ? 0 : 1)
        }}
      />
    )

    const downvote = (
      <VoteButton
        size={18 * scale}
        Icon={ChevronDown}
        voted={vote == -1}
        color={vote === -1 ? 'red' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote == -1 ? 0 : -1)
        }}
      />
    )

    const color = ratio < 0.4 ? red : ratio < 0.6 ? orange : green

    return (
      <VStack
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.125)"
        shadowRadius={6}
        shadowOffset={{ height: 3, width: -1 }}
        borderRadius={1000}
        {...props}
      >
        {/* <AbsoluteVStack
          fullscreen
          borderRadius={1000}
          backgroundColor={lightGreen}
          transform={[{ scale: ratio }]}
          zIndex={-1}
        /> */}

        {typeof ratio === 'number' && (
          <AbsoluteVStack
            fullscreen
            opacity={0.8}
            // transform={[{ scale: 0.95 }]}
          >
            <CircularProgress
              fill={ratio * 100}
              size={sizePx}
              width={2}
              tintColor={color}
              lineCap="round"
              // arcSweepAngle={180}
              rotation={(1 - ratio) * 180}
            />
          </AbsoluteVStack>
        )}

        {subtle ? (
          upvote
        ) : (
          <Tooltip position="right" contents="Upvote" {...isOpenProp}>
            {upvote}
          </Tooltip>
        )}
        <Text
          fontSize={Math.min(16, sizePx / `${score}`.length) * scale * 1.075}
          fontWeight="700"
          marginVertical={-2 * scale}
          letterSpacing={-0.5}
          color={color}
        >
          {score ?? ''}
        </Text>
        {subtle ? (
          downvote
        ) : (
          <Tooltip position="right" contents="Downvote" {...isOpenProp}>
            {downvote}
          </Tooltip>
        )}
      </VStack>
    )
  }
)

export const VoteButton = ({
  color,
  Icon,
  size = 18,
  voted,
  hoverColor,
  ...props
}: StackProps & {
  hoverColor?: string
  voted?: boolean
  Icon: any
  color?: string | null
  size?: number
}) => {
  const isSmall = useIsNarrow()
  const scale = isSmall ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  return (
    <VStack
      width={22 * scale}
      height={22 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={prevent}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...props}
    >
      <Icon
        size={size * (voted ? 1.2 : 1)}
        color={hovered ? hoverColor ?? '#000' : color ?? '#ccc'}
      />
    </VStack>
  )
}

export default class CircularProgress extends React.PureComponent<any> {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999)
    var end = this.polarToCartesian(x, y, radius, startAngle)
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    var d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ]
    return d.join(' ')
  }

  clampFill = (fill) => Math.min(100, Math.max(0, fill))

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      tintTransparency,
      backgroundColor,
      style,
      rotation,
      lineCap,
      fillLineCap = lineCap,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle,
      padding,
      renderCap,
      dashedBackground,
      dashedTint,
    } = this.props

    const maxWidthCircle = backgroundWidth
      ? Math.max(width, backgroundWidth)
      : width
    const sizeWithPadding = size / 2 + padding / 2
    const radius = size / 2 - maxWidthCircle / 2 - padding / 2

    const currentFillAngle = (arcSweepAngle * this.clampFill(fill)) / 100
    const backgroundPath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      tintTransparency ? 0 : currentFillAngle,
      arcSweepAngle
    )
    const circlePath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      0,
      currentFillAngle
    )
    const coordinate = this.polarToCartesian(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      currentFillAngle
    )
    const cap = this.props.renderCap
      ? this.props.renderCap({ center: coordinate })
      : null

    const offset = size - maxWidthCircle * 2

    const localChildrenContainerStyle = {
      ...{
        position: 'absolute',
        left: maxWidthCircle + padding / 2,
        top: maxWidthCircle + padding / 2,
        width: offset,
        height: offset,
        borderRadius: offset / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      ...childrenContainerStyle,
    }

    const strokeDasharrayTint =
      dashedTint.gap > 0
        ? Object.values(dashedTint).map((value) => parseInt(value))
        : null

    const strokeDasharrayBackground =
      dashedBackground.gap > 0
        ? Object.values(dashedBackground).map((value) => parseInt(value))
        : null

    return (
      <View style={style}>
        <Svg width={size + padding} height={size + padding}>
          <G
            rotation={rotation}
            originX={(size + padding) / 2}
            originY={(size + padding) / 2}
          >
            {backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                strokeDasharray={strokeDasharrayBackground}
                fill="transparent"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={tintColor}
                strokeWidth={width}
                strokeLinecap={fillLineCap}
                strokeDasharray={strokeDasharrayTint}
                fill="transparent"
              />
            )}
            {cap}
          </G>
        </Svg>
        {children && (
          <View style={localChildrenContainerStyle}>{children(fill)}</View>
        )}
      </View>
    )
  }
}

// CircularProgress.propTypes = {
//   style: PropTypes.object,
//   size: PropTypes.oneOfType([
//     PropTypes.number,
//     PropTypes.instanceOf(Animated.Value),
//   ]).isRequired,
//   fill: PropTypes.number.isRequired,
//   width: PropTypes.number.isRequired,
//   backgroundWidth: PropTypes.number,
//   tintColor: PropTypes.string,
//   tintTransparency: PropTypes.bool,
//   backgroundColor: PropTypes.string,
//   rotation: PropTypes.number,
//   lineCap: PropTypes.string,
//   arcSweepAngle: PropTypes.number,
//   children: PropTypes.func,
//   childrenContainerStyle: PropTypes.object,
//   padding: PropTypes.number,
//   renderCap: PropTypes.func,
//   dashedBackground: PropTypes.object,
//   dashedTint: PropTypes.object
// };

CircularProgress.defaultProps = {
  tintColor: 'black',
  tintTransparency: true,
  rotation: 90,
  lineCap: 'butt',
  arcSweepAngle: 360,
  padding: 0,
  dashedBackground: { width: 0, gap: 0 },
  dashedTint: { width: 0, gap: 0 },
}
