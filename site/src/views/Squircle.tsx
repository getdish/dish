import { View, ViewProps } from '@o/ui'
import { useAnimation } from 'framer-motion'
import React from 'react'

// @ts-ignore
if (CSS.paintWorklet) {
  // @ts-ignore
  CSS.paintWorklet.addModule(
    process.env.NODE_ENV === 'development' ? '/public/smooth-corners.js' : '/smooth-corners.js'
  )
}

export const TiltSquircle = ({ style, ...rest }: ViewProps) => {
  const tilt = useAnimation()
  return (
    <Squircle
      onMouseMove={({ clientX: x, clientY: y }) =>
        tilt.start({
          rotateY: (x - window.innerWidth / 2) / 40,
          rotateX: -(y - window.innerHeight / 2) / 40,
          scale: 1.1,
        })
      }
      onMouseLeave={() => tilt.start({ rotateY: 0, rotateX: 0, scale: 1 })}
      data-is="TiltSquircle"
      animate={tilt}
      {...rest}
    />
  )
}

export const Squircle = ({
  boxShadow,
  width,
  height,
  position,
  margin,
  zIndex,
  ...props
}: ViewProps) => (
  <View
    perspective="1000px"
    {...{
      width,
      height,
      position,
      margin,
      zIndex,
    }}
  >
    <View
      data-is="Squircle"
      width={width}
      height={height}
      style={{
        maskImage: 'paint(smooth-corners)',
        WebkitMaskImage: 'paint(smooth-corners)',
        borderRadius: 60,
      }}
      {...props}
    />
    {!!boxShadow && (
      <View
        position="absolute"
        zIndex={-1}
        borderRadius={+width / 3}
        transformOrigin="center center"
        transform={{
          scale: 0.98,
        }}
        {...{
          width,
          height,
          boxShadow,
        }}
      />
    )}
  </View>
)
