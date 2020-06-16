import { StackProps, Text, VStack, combineFns, prevent } from '@dish/ui'
import React, { useRef } from 'react'

import { RoutesTable } from '../../state/router'
import { Link, getStylePadding } from './Link'
import { LinkButtonProps } from './LinkProps'
import { asyncLinkAction, useNormalizeLinkProps } from './useNormalizedLink'

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkButtonProps<Name, Params>) {
  let restProps: StackProps
  let contents: React.ReactElement
  const containerRef = useRef<any>()

  // this handles the tag/name/params props
  let props = useNormalizeLinkProps(allProps)

  if ('name' in props) {
    const {
      name,
      params,
      children,
      onPress,
      fontSize,
      ellipse,
      lineHeight,
      fontWeight,
      padding,
      paddingVertical,
      paddingHorizontal,
      disabledIfActive,
      replace,
      preventNavigate,
      textAlign,
      ...rest
    } = props
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        replace={replace}
        onClick={onPress}
        asyncClick
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        textAlign={textAlign}
        preventNavigate={preventNavigate}
        padding={getStylePadding({
          padding,
          paddingVertical,
          paddingHorizontal,
        })}
      >
        {children ?? ''}
      </Link>
    )
  } else {
    const {
      children,
      fontSize,
      lineHeight,
      fontWeight,
      textAlign,
      ellipse,
      replace,
      disabledIfActive,
      ...rest
    } = props
    restProps = rest
    contents = (
      <Text
        ellipse={ellipse}
        fontSize={fontSize}
        lineHeight={lineHeight}
        fontWeight={fontWeight}
        textAlign={textAlign}
      >
        {children ?? ''}
      </Text>
    )
  }

  return (
    <VStack
      // only handle click events on non-a links (we handle them in Link separately)
      // @ts-ignore
      ref={'name' in props ? null : containerRef}
      pressStyle={{
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
      }}
      {...restProps}
      className={`cursor-pointer ${props.className ?? 'ease-in-out-faster'}`}
    >
      {contents}
    </VStack>
  )
}
