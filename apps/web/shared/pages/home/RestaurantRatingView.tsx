import { graphql } from '@dish/graph'
import React, { memo } from 'react'

import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { RatingView, RatingViewProps } from './RatingView'
import { restaurantQuery } from './restaurantQuery'

export type RestaurantRatingViewProps = Omit<
  Pick<RatingViewProps, 'size'>,
  'percent' | 'color'
> & {
  restaurantSlug: string
  rating: number
}

export default memo(
  graphql(function RestaurantRatingView(props: RestaurantRatingViewProps) {
    let { restaurantSlug, rating, ...rest } = props
    // optionally fetch
    if (typeof rating === 'undefined') {
      const restaurant = restaurantQuery(restaurantSlug)
      rating = restaurant.rating
    }
    const percent = getRestaurantRating(rating)
    const color = getRankingColor(percent)
    return (
      <>
        <RatingView percent={percent} color={color} {...rest} />
        {/* {rest.size === 'lg' && <RestaurantRatingBreakdownView {...props} />} */}
      </>
    )
  })
)

// const RestaurantRatingBreakdownView = memo(
//   graphql(({ restaurantSlug }: RestaurantRatingViewProps) => {
//     const [restaurant] = query.restaurant({
//       where: {
//         slug: {
//           _eq: restaurantSlug,
//         },
//       },
//     })
//     // @ts-ignore bad generate
//     const ratingFactors = restaurant.rating_factors()
//     return (
//       <>
//         <HoverablePopover
//           contents={
//             <Box>
//               <VStack marginTop={-8} marginHorizontal={-18} alignItems="center">
//                 <HStack
//                   alignItems="center"
//                   paddingHorizontal={10 + 18}
//                   spacing={20}
//                   paddingVertical={12}
//                 >
//                   <VStack
//                     zIndex={10}
//                     flex={1}
//                     minWidth={68}
//                     maxWidth={120}
//                     marginHorizontal={-12}
//                   >
//                     <RatingBreakdownCircle
//                       percent={ratingFactors?.food}
//                       emoji="🧑‍🍳"
//                       name="Food"
//                     />
//                   </VStack>
//                   <VStack
//                     zIndex={9}
//                     flex={1}
//                     minWidth={68}
//                     maxWidth={120}
//                     marginHorizontal={-12}
//                   >
//                     <RatingBreakdownCircle
//                       percent={ratingFactors?.service}
//                       emoji="💁‍♂️"
//                       name="Service"
//                     />
//                   </VStack>
//                   <VStack
//                     zIndex={8}
//                     flex={1}
//                     minWidth={68}
//                     maxWidth={120}
//                     marginHorizontal={-12}
//                   >
//                     <RatingBreakdownCircle
//                       percent={ratingFactors?.ambience}
//                       emoji="✨"
//                       name="Decor"
//                     />
//                   </VStack>
//                 </HStack>
//               </VStack>
//             </Box>
//           }
//         >
//           <HStack
//             position="relative"
//             height="100%"
//             alignItems="center"
//             marginHorizontal={-10}
//             zIndex={-1}
//           >
//             <Circle zIndex={3} marginHorizontal={-3} size={18 + 20}>
//               <RatingBreakdownCircle
//                 percent={ratingFactors?.service}
//                 emoji="👩‍🍳"
//                 size={18}
//               />
//             </Circle>
//             <Circle zIndex={2} marginHorizontal={-3} size={18 + 20}>
//               <RatingBreakdownCircle
//                 percent={ratingFactors?.service}
//                 emoji="💁‍♂️"
//                 size={18}
//               />
//             </Circle>
//             <Circle zIndex={1} marginHorizontal={-3} size={18 + 20}>
//               <RatingBreakdownCircle
//                 percent={ratingFactors?.service}
//                 emoji="✨"
//                 size={18}
//               />
//             </Circle>
//           </HStack>
//         </HoverablePopover>
//       </>
//     )
//   })
// )
// const RatingBreakdownCircle = memo(
//   ({
//     emoji,
//     name,
//     percent,
//     size = 43,
//   }: {
//     emoji: string
//     name?: string
//     size?: number
//     percent: number
//   }) => {
//     return (
//       <VStack
//         borderRadius={100}
//         alignItems="center"
//         width="100%"
//         height="auto"
//         paddingTop="100%"
//         // backgroundColor="#fff"
//         shadowColor="rgba(0,0,0,0.06)"
//         shadowRadius={8}
//         shadowOffset={{ height: 4, width: 0 }}
//       >
//         <ZStack
//           top={0}
//           left={0}
//           right={0}
//           bottom={0}
//           position="absolute"
//           borderRadius={100}
//           // backgroundColor="white"
//           overflow="hidden"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <ProgressCircle
//             percent={50}
//             radius={size}
//             borderWidth={1}
//             color="#ccc"
//           />
//         </ZStack>
//         <ZStack
//           fullscreen
//           alignItems="center"
//           justifyContent="center"
//           width={size * 2.4}
//         >
//           <Text fontSize={size * 0.9} marginBottom={0}>
//             {emoji}
//           </Text>
//           {!!name && (
//             <Text fontSize={size * 0.5} color="#555" fontWeight="700">
//               {name}
//             </Text>
//           )}
//         </ZStack>
//       </VStack>
//     )
//   }
// )
