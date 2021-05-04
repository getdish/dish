import { Plus } from '@dish/react-feather'
import React, { Suspense, useState } from 'react'
import { useTheme } from 'snackui'
import { Button, Tooltip } from 'snackui'

import { userStore } from '../../userStore'
import { SmallButtonProps } from '../../views/SmallButton'
import { RestaurantAddToListModal } from './RestaurantAddToListModal'

export const RestaurantAddToListButton = ({
  restaurantSlug,
  noLabel,
  ...props
}: SmallButtonProps & {
  restaurantSlug?: string
  noLabel?: boolean
}) => {
  const [showModal, setShowModal] = useState(false)
  const theme = useTheme()
  return (
    <>
      {!!(showModal && restaurantSlug) && (
        <Suspense fallback={null}>
          <RestaurantAddToListModal slug={restaurantSlug} onDismiss={() => setShowModal(false)} />
        </Suspense>
      )}
      <Tooltip contents="Add to list">
        <Button
          icon={<Plus color={'#777'} size={16} />}
          tooltip="Add to list"
          onPress={() => {
            if (!userStore.promptLogin()) {
              setShowModal(true)
            }
          }}
          pressStyle={{
            opacity: 0.6,
          }}
          shadowColor={theme.shadowColor}
          shadowOffset={{ height: 2, width: 0 }}
          shadowRadius={4}
          {...props}
        >
          {noLabel ? null : 'List'}
        </Button>
      </Tooltip>
    </>
  )
}
