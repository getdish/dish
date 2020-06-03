import { graphql, query } from '@dish/graph'
import {
  Text,
  Toast,
  VStack,
  useDebounceEffect,
  useForceUpdate,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { Star } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { getInputNode } from './HomeSearchBar'

export const RestaurantFavoriteStar = memo(
  graphql(
    ({
      size = 'md',
      restaurantId,
    }: {
      isHovered?: boolean
      size?: 'lg' | 'md'
      restaurantId: string
    }) => {
      const sizePx = size == 'lg' ? 26 : 16
      const om = useOvermind()
      const [isOpen, setIsOpen] = useState(false)
      const [timer, setTimer] = useState(null)
      const forceUpdate = useForceUpdate()
      const showContent = isOpen
      const [review] = query.review({
        limit: 1,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
          user_id: {
            _eq: om.state.user.user?.id,
          },
        },
      })
      const isStarred = review?.rating > 0
      // const [writeReview, info] = useReviewMutation()

      const persist = async () => {
        Toast.show('Saved')
      }

      const setRating = (r: number) => {
        if (!om.actions.user.ensureLoggedIn()) {
          return
        }
        review.rating = r
        setIsOpen(r == 1)
        review.restaurant_id = restaurantId
        persist()
        forceUpdate()
      }

      const [input, setInput] = useState<any>(null)
      const node = getInputNode(input)
      useDebounceEffect(
        () => {
          if (showContent && node) {
            const tm = requestIdleCallback(() => {
              node.focus()
            })
            return () => {
              clearTimeout(tm)
            }
          }
        },
        16,
        [node, showContent]
      )

      return (
        <LinkButton onPress={() => setRating(isStarred ? 0 : 1)}>
          <VStack
            marginTop={2}
            width={sizePx}
            height={sizePx}
            overflow="hidden"
          >
            {isStarred && (
              <Text
                fontSize={sizePx * 0.88}
                lineHeight={sizePx * 0.88}
                marginTop={3}
                marginLeft={2}
              >
                ⭐️
              </Text>
            )}
            {!isStarred && <Star size={sizePx} color={'goldenrod'} />}
          </VStack>
        </LinkButton>
      )
    }
  )
)

// <Popover
//   isOpen={isOpen}
//   onChangeOpen={setIsOpen}
//   overlay
//   position="right"
//   contents={
//     <Box width={520}>
//       {showContent && (
//         <>
//           <Spacer />
//           <HStack flex={1} alignItems="center">
//             <VStack>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//               >
//                 <HStack alignItems="center" spacing={size}>
//                   <Icon size={20} name="Tag" />
//                   {om.state.home.allLenseTags
//                     .filter((x) => x.isVotable)
//                     .map((lense) => (
//                       <LenseButton
//                         key={lense.id}
//                         lense={lense}
//                         isActive={false}
//                       />
//                     ))}
//                   <Spacer />
//                 </HStack>
//               </ScrollView>
//             </VStack>
//           </HStack>
//         </>
//       )}
//     </Box>
//   }
// >
// </Popover>
