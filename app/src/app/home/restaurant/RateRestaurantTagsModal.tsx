import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { Button, HStack, Modal, Paragraph, Spacer, VStack } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { CloseButton, SmallCircleButton } from '../../views/CloseButton'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { ListItemHStack } from './RestaurantReview'

// const meta = (
//   <>
//     {!!review.rating && (
//       <Text
//         {...bottomMetaTextProps}
//         borderRadius={100}
//         backgroundColor={
//           review.rating >= 4 ? green200 : review.rating >= 3 ? yellow200 : red200
//         }
//         lineHeight={20}
//         paddingHorizontal={12}
//         // @ts-ignore
//         display={isWeb ? 'inline-flex' : 'flex'}
//         alignItems="center"
//         justifyContent="center"
//         margin={-2}
//         fontSize={12}
//         fontWeight="400"
//       >
//         {review.rating === 1 ? 'Upvote' : 'Downvote'}
//       </Text>
//     )}
//     {authoredAt}
//   </>
// )
// const bottomMetaTextProps: TextProps = {
//   lineHeight: 26,
//   fontSize: 14,
//   color: 'rgba(0,0,0,0.7)',
// }
export const RateRestaurantTagsModal = ({ onDismiss }: { onDismiss: any }) => {
  const [showRateModal, setShowRateModal] = useState(false)
  return (
    <>
      <Modal visible maxWidth={480} width="90%" maxHeight="90%" onDismiss={onDismiss}>
        <PaneControlButtons>
          <CloseButton onPress={onDismiss} />
        </PaneControlButtons>

        <Spacer />

        <SlantedTitle size="xs" alignSelf="center">
          Rate tags
        </SlantedTitle>

        <Spacer />
        <Spacer />

        <FlatList
          style={{
            width: '100%',
          }}
          data={[...tagLenses]}
          renderItem={(props) => {
            return (
              <ListItemHStack>
                <Paragraph>{props.item.name}</Paragraph>
                <VStack flex={1} />
                <Button theme="active" onPress={() => setShowRateModal(true)}>
                  Rate
                </Button>
              </ListItemHStack>
            )
          }}
        />
      </Modal>

      {showRateModal && (
        <Modal visible maxWidth={480} width="90%" maxHeight="90%" onDismiss={onDismiss}>
          <RateRestaurantTagModal onDismiss={() => setShowRateModal(false)} />
        </Modal>
      )}
    </>
  )
}
const RateRestaurantTagModal = ({ onDismiss }: { onDismiss: any }) => {
  return (
    <Modal visible maxWidth={480} width="90%" maxHeight="90%" onDismiss={onDismiss}>
      <PaneControlButtons>
        <CloseButton onPress={onDismiss} />
      </PaneControlButtons>

      <Spacer />

      <SlantedTitle size="xs" alignSelf="center">
        Rate tag
      </SlantedTitle>

      <Spacer />

      <HStack spacing="xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <SmallCircleButton key={rating}>{rating}</SmallCircleButton>
        ))}
      </HStack>

      <Spacer />
    </Modal>
  )
}
