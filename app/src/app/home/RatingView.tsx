import { Card, Paragraph } from '@dish/ui'
import React, { forwardRef } from 'react'

export type RatingViewProps = {
  size: number
  rating: number
  count?: number
  floating?: boolean
  stacked?: boolean
}

export const RatingView = forwardRef(
  ({ rating = 0, count, size, floating, stacked }: RatingViewProps, ref) => {
    let ratingStr = (Math.round(Math.max(0, rating * 10)) / 10).toFixed(1)
    if (rating == 0) {
      ratingStr = '?'
    }
    const content = (
      <Paragraph
        ref={ref as any}
        ellipse
        size={size * (floating ? 0.4 : 0.5)}
        fontWeight="800"
        letterSpacing={-0.75}
      >
        {ratingStr}
      </Paragraph>
    )
    if (!floating) {
      return content
    }
    return (
      <Card
        width={size}
        height={size}
        elevation="$1"
        borderRadius={1000}
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </Card>
    )
  }
)

// export const RatingView = ({
//   rating = 0,
//   count,
//   size,
//   floating,
//   stacked,
// }: RatingViewProps) => {
//   const theme = useTheme()
//   const countText = count ? `${numberFormat(count, 'sm')}` : null
//   const longText = countText ? countText.length > 2 : false
//   const ratingInner = rating * 0.7
//   const ratingMiddle = rating * 0.5
//   // const rotate = `${(1 - ratingInner / 100) * 180}deg`
//   const width = size * 0.04
//   const stackedSize = size * 0.8
//   const innerSize = Math.round(stacked ? stackedSize : size * 0.33)
//   const middleSize = Math.round(stacked ? stackedSize : size * 0.6)
//   const outerSize = Math.round(stacked ? stackedSize : size * 0.85)

//   if (!stacked) {
//     return (
//       <YStack
//         alignItems="center"
//         justifyContent="center"
//         position="relative"
//         borderRadius={1000}
//         width={size}
//         height={size}
//         {...(floating && {
//           backgroundColor: theme.bg,
//           shadowColor: theme.shadowColor,
//           shadowRadius: 5,
//         })}
//       >
//         {/* <AbsoluteYStack zIndex={-1} opacity={0.5}>
//           <Circle size={size} backgroundColor={theme.color} opacity={0.9} />
//         </AbsoluteYStack> */}
//         {outerRing}

//         {typeof count !== 'undefined' && (
//           <AbsoluteYStack
//             zIndex={-1}
//             top="-24%"
//             right="-24%"
//             width={size * 0.55}
//             height={size * 0.55}
//             borderRadius={100}
//             justifyContent="center"
//             alignItems="center"
//             backgroundColor={theme.bg}
//             shadowColor={theme.shadowColor}
//             shadowRadius={5}
//             shadowOffset={{ height: 2, width: 0 }}
//           >
//             <Text
//               letterSpacing={-0.5}
//               color={theme.color}
//               opacity={0.75}
//               fontWeight="800"
//               fontSize={longText ? 12 : 14}
//             >
//               {countText}
//             </Text>
//           </AbsoluteYStack>
//         )}
//       </YStack>
//     )
//   }

//   return (
//     <XStack space="$2">
//       <XStack display="inline-flex" alignItems="center">
//         {outerRing}
//         <Spacer size="$1" />
//         <Text>
//           Food
//           <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
//             {Math.round(rating)}%
//           </Text>
//         </Text>
//       </XStack>
//       <XStack alignItems="center">
//         {middleRing}
//         <Spacer size="$1" />
//         <Text>
//           Service
//           <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
//             {Math.round(ratingMiddle)}%
//           </Text>
//         </Text>
//       </XStack>
//       <XStack alignItems="center">
//         {innerRing}
//         <Spacer size="$1" />
//         <Text>
//           Ambience
//           <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
//             {Math.round(ratingInner)}%
//           </Text>
//         </Text>
//       </XStack>
//       {typeof count !== 'undefined' && (
//         <XStack alignItems="center">
//           <YStack width={size} height={size} alignItems="center" justifyContent="center">
//             <Text color={theme.color} opacity={0.5} fontWeight="600" fontSize={longText ? 10 : 12}>
//               {countText}
//             </Text>
//           </YStack>
//           <Spacer />
//           <Text>Reviews</Text>
//         </XStack>
//       )}
//     </XStack>
//   )
// }
