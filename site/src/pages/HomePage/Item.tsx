import { Icon, SimpleText, Stack } from '@o/ui'
import React from 'react'

export const Item = (props) => (
  <Stack direction="horizontal" space padding={['sm', 0]}>
    <Icon opacity={0.5} name="tick" />
    <SimpleText flex={1} size="md" alpha={0.75} {...props} />
  </Stack>
)
