export const rgbString = (color: readonly [number, number, number], alpha?: number) =>
  typeof alpha === 'number' ? `rgba(${color.join(',')},${alpha})` : `rgb(${color.join(',')})`
