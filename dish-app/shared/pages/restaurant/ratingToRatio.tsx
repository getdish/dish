export const ratingToRatio = (rating: number) => {
  let num = Math.max(1, rating ?? 1)
  if (num >= 3.5) {
    num = scaleValue(num, [3.5, 4.8], [3.5, 8])
  }
  return num / 8
}
export const scaleValue = (
  value: number,
  from: [number, number],
  to: [number, number]
) => {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return ~~(capped * scale + to[0])
}
