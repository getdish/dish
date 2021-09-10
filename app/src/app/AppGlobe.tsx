import React, { memo, useEffect, useRef } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'

import earthDark from '../assets/earth-dark.jpg'

export default memo(({ features }: { features: any[] }) => {
  const globeRef = useRef<GlobeMethods>()

  useEffect(() => {
    if (!globeRef.current) return
    const globe = globeRef.current
    console.log('globe', globe)
    const controls = globe.controls() as any
    console.log('controls', controls)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.25
  }, [])

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={earthDark}
      arcDashAnimateTime={5000}
      arcsTransitionDuration={5000}
      enablePointerInteraction={false}
      showGraticules
      showAtmosphere
      animateIn
      hexPolygonsData={features}
      hexPolygonResolution={4}
      hexPolygonMargin={0.3}
      hexPolygonColor={() =>
        `#${Math.round(Math.random() * Math.pow(2, 24))
          .toString(16)
          .padStart(6, '0')}`
      }
    />
  )
})
