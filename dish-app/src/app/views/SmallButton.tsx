import React from 'react'
import { Button, HStack, Text, Tooltip, useTheme } from 'snackui'

import {
  bgLight,
  bgLightLight,
  brandColor,
  lightBlue,
} from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { isStringChild } from '../../helpers/isStringChild'
import { Link } from './Link'
import { LinkButtonProps } from './LinkProps'

export type SmallButtonProps = LinkButtonProps & {
  isActive?: boolean
  tooltip?: string
}

export const SmallButton = ({
  isActive,
  children,
  tooltip,
  name,
  tag,
  tags,
  params,
  href,
  ...rest
}: SmallButtonProps) => {
  const theme = useTheme()

  let contents = (
    <Button
      borderRadius={20}
      borderWidth={1}
      backgroundColor="transparent"
      borderColor={theme.borderColor}
      {...(isWeb && {
        minHeight: 36,
        minWidth: 44,
      })}
      {...(!isWeb && {
        minHeight: 42,
        minWidth: 48,
      })}
      {...(isActive && {
        backgroundColor: theme.backgroundColor,
      })}
      {...rest}
    >
      {children}
    </Button>
  )

  if (name || tag || tags || params || href) {
    contents = (
      <Link name={name} tag={tag} tags={tags} params={params} href={href}>
        {contents}
      </Link>
    )
  }

  if (tooltip) {
    return <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  return contents
}
