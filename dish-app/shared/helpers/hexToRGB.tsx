export const hexToRGB = (hex: string, a = 1) => {
  const [_, r, g, b] =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? []
  const rgb = [r, g, b].map((x) => parseInt(x, 16))
  return { rgb, string: `rgba(${rgb.join(',')},${a})` }
}
