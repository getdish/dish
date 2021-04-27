export type RGB = [number, number, number] | [number, number, number, number]

export const hexToRGB = (hex: string, a = 1) => {
  const [_, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? []
  const rgb = ([r, g, b].map((x) => parseInt(x, 16)) as any) as RGB
  return { rgb, string: `rgba(${rgb.join(',')},${a})` }
}

export const rgbString = (color: RGB, alpha = 1) => {
  if (color.length === 4) {
    alpha = color[3] ?? alpha ?? 1
    color = color.slice(0, 3) as RGB
  }
  return alpha !== 1 ? `rgba(${color.join(',')},${alpha})` : `rgb(${color.join(',')})`
}
