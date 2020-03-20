import React from 'react'
export function BlurView() {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(20px)',
      }}
    />
  )
}
