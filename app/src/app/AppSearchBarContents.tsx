import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { Link } from './views/Link'
import { LogoCircle } from './views/Logo'
import { Button, Spacer, XStack, YStack } from '@dish/ui'
import React, { memo } from 'react'

export const AppSearchBarContents = memo(() => {
  return (
    <XStack zi={100} ai="center" px="$2">
      <Link asChild name="home">
        <Button size="$6" px="$3" chromeless>
          <LogoCircle />
        </Button>
      </Link>
      <AppSearchInput />
      <Spacer size={8} />
      {/* native needs set widht */}
      <YStack w={60}>
        <AppMenuButton />
      </YStack>
    </XStack>
  )
})
