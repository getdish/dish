export const rgbString = (color: number[], alpha?: number) =>
  alpha ? `rgba(${color.join(',')},${alpha})` : `rgb(${color.join(',')})`
