// import React, { memo } from 'react'
// import { AbsoluteYStack, XStack, LoadingItem, YStack } from '@dish/ui'

// import { useHomeStore } from '../homeStore'
// import { LinkButton } from '../views/LinkButton'
// import { TrendingButton } from '../views/TrendingButton'

// export const HomeViewTopDishesTrending = memo(() => {
//   const home = useHomeStore()
//   const topRestaurants = [] //home.topDishes[0]?.top_restaurants ?? []
//   const hasLoaded = false // topRestaurants.length > 0

//   // @tom if you change Partial<any> to Partial<Restauarant>
//   // you can see below at `getTrending` they disagree on Restaurant
//   // if its >10m to fix we can leave it as any for now
//   const getTrending = (restaurant: Partial<any>, index: number) => {
//     return (
//       <TrendingButton
//         key={`${index}${restaurant.id}`}
//         name="restaurant"
//         params={{
//           slug: restaurant.slug,
//         }}
//       >
//         {['🍔', '🌮', '🥗', '🍲', '🥩'][(index % 4) + 1]} {restaurant.name}
//       </TrendingButton>
//     )
//   }

//   const listSpace = 3
//   const total = 5

//   return (
//     <YStack height={188 + listSpace * (total - 1)}>
//       <XStack space="$6" paddingHorizontal={10}>
//         <YStack flex={1}>
//           <AbsoluteYStack position="absolute" top={-5} left={-12} zIndex={100}>
//             <LinkButton
//               paddingVertical={5}
//               paddingHorizontal={6}
//               shadowColor={'rgba(0,0,0,0.1)'}
//               shadowRadius={8}
//               shadowOffset={{ height: 2, width: 0 }}
//               backgroundColor="#fff"
//               borderRadius={8}
//               transform={[{ rotate: '-4deg' }]}
//             >
//               Trending
//             </LinkButton>
//           </AbsoluteYStack>
//           <YStack space={6}>
//             {/* <SmallerTitle marginBottom={5}>Restaurants</SmallerTitle> */}
//             <YStack space={listSpace} overflow="hidden">
//               {!hasLoaded && <LoadingItem />}
//               {topRestaurants.slice(0, total).map(getTrending)}
//             </YStack>
//           </YStack>
//         </YStack>
//         <YStack flex={1} space={6}>
//           {/* <SmallerTitle marginBottom={5}>Dishes</SmallerTitle> */}
//           <YStack space={listSpace} overflow="hidden">
//             {!hasLoaded && <LoadingItem />}
//             {topRestaurants.slice(0, total).map(getTrending)}
//           </YStack>
//         </YStack>
//         {/* <MediaQuery query={mediaQueries.md}>
//           <YStack flex={1} space={6}>
//             <SmallerTitle marginBottom={5}>Topics</SmallerTitle>
//             <YStack space={listSpace} overflow="hidden">
//               {!hasLoaded && <LoadingItem />}
//               {topRestaurants.slice(0, total).map(getTrending)}
//             </YStack>
//           </YStack>
//         </MediaQuery> */}
//       </XStack>
//     </YStack>
//   )
// })
