import { StackProps, Text, VStack, prevent } from '@dish/ui'
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
  let onPress: any
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
      fastClick,
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
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        textAlign={textAlign}
        fastClick={fastClick}
        padding={getStylePadding({
          padding,
          paddingVertical,
          paddingHorizontal,
        })}
        preventNavigate={preventNavigate}
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

  const onPressCb = onPress ? asyncLinkAction(onPress) : null

  return (
    <VStack
      // only handle click events on non-a links (we handle them in Link separately)
      // @ts-ignore
      ref={'name' in props ? null : containerRef}
      pressStyle={{
        opacity: 0.7,
        transform: [{ scale: 0.945 }],
      }}
      {...props.containerStyle}
      {...restProps}
      {...(props.fastClick
        ? { onPressIn: onPressCb }
        : { onPressOut: onPressCb })}
      className={`cursor-pointer ${props.className ?? 'ease-in-out-superfast'}`}
    >
      {contents}
    </VStack>
  )
}
