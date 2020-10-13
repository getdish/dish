export const rgbString = (color: number[], alpha?: number) =>
  typeof alpha === 'number'
    ? `rgba(${color.join(',')},${alpha})`
    : `rgb(${color.join(',')})`
