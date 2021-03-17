import { createContextualProps, Parallax, ParallaxViewProps } from '@o/ui'
import { selectDefined } from '@o/utils'
import React, { memo, useEffect, useState } from 'react'

import { SectionContent, SectionContentProps } from './SectionContent'

const { PassProps, useProps } = createContextualProps<SectionContentProps>({
  zIndex: 0,
  overflow: 'visible',
})

export function Page(props: SectionContentProps) {
  return (
    <PassProps overflow="visible" zIndex={0} {...props}>
      <Parallax.Container>
        {/* close to working but its not "centered" */}
        {/* <ParallaxStageItem
          parallax={{
            y: {
              relativeTo: 'frame',
              transition: 'ease-in',
              speed: 1,
              move: 200,
            },
          }}
        > */}
        <SectionContent
          data-is="Site-Page"
          alignItems="center"
          justifyContent="center"
          {...props}
          flex="none"
          xs-height="auto"
          xs-minHeight="auto"
          contain="content paint"
        />
        {/* </ParallaxStageItem> */}
      </Parallax.Container>
    </PassProps>
  )
}

Page.ParallaxView = ({ overflow, zIndex, style, ...props }: ParallaxViewProps) => {
  const parallax = useProps()
  return (
    // <View display="contents" {...mediaStyles.hiddenWhen.xs}>
    <Parallax.View
      speed={0.2}
      style={{
        zIndex: +parallax.zIndex + (+zIndex || 0) + 1,
        overflow: selectDefined(overflow, parallax.overflow),
        ...style,
      }}
      {...props}
    />
    // </View>
  )
}

Page.BackgroundParallax = memo(({ speed, ...props }: ParallaxViewProps) => {
  const { zIndex } = useProps()
  const [shown, setShown] = useState()
  useEffect(() => {
    setShown(true)
  }, [])
  return (
    <Page.ParallaxView
      zIndex={(props.zIndex || 0) + zIndex - 2}
      className="page-background"
      transition="opacity ease 1500ms"
      position="absolute"
      pointerEvents="none"
      left="5%"
      top="2%"
      width="90%"
      height="94%"
      {...props}
      speed={speed * 20}
      opacity={shown ? props.opacity || 1 : 0}
    />
  )
})
