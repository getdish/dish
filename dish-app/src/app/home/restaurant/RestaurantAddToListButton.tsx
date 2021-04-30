import { Plus } from '@dish/react-feather'
import React, { Suspense, useState } from 'react'
import { Button, Tooltip } from 'snackui'

import { userStore } from '../../userStore'
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
        <Button
          cursor="pointer"
          icon={<Plus color={'#777'} size={size ?? 16} />}
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
          {noLabel ? null : 'List'}
        </Button>
      </Tooltip>
    </>
  )
}
