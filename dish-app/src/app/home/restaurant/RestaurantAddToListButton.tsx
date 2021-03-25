import { Plus } from '@dish/react-feather'
import React, { Suspense, useState } from 'react'
import { Spacer, Text, Tooltip } from 'snackui'

import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import { SmallButtonProps } from '../../views/SmallButton'
import { RestaurantAddToListModal } from './RestaurantAddToListModal'

export const RestaurantAddToListButton = ({
  restaurantSlug,
  noLabel,
  theme = 'active',
  shadowed,
  size,
  subtle,
  ...props
}: SmallButtonProps & {
  theme?: string | null
  size?: number
  restaurantSlug?: string
  noLabel?: boolean
  shadowed?: boolean
  subtle?: boolean
}) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      {!!(showModal && restaurantSlug) && (
        <Suspense fallback={null}>
          <RestaurantAddToListModal slug={restaurantSlug} onDismiss={() => setShowModal(false)} />
        </Suspense>
      )}
      <Tooltip contents="Add to list">
        <SmallCircleButton
          subtle={subtle}
          cursor="pointer"
          shadowed={shadowed}
          tooltip="Add to list"
          onPress={() => {
            if (!userStore.promptLogin()) {
              setShowModal(true)
            }
          }}
          pressStyle={{
            opacity: 0.6,
          }}
          {...props}
        >
          <Spacer size="xs" />
          <Plus color={subtle ? '#555' : '#fff'} size={size ?? 16} />
          {!noLabel && (
            <>
              <Spacer size="xs" />
              <Text color="#fff" fontSize={14} fontWeight="600">
                List
              </Text>
            </>
          )}
          <Spacer size="xs" />
        </SmallCircleButton>
      </Tooltip>
    </>
  )
}
