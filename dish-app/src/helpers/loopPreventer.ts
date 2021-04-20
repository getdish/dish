class LoopError extends Error {}

export const loopPreventer = ({ max = 4, per = 1 }: { max: number; per: number }) => {
  // avoid nasty two way sync bugs as much as possible
  // prevents router loops
  let runs = 0
  let tm: any
  return () => {
    runs++
    clearTimeout(tm)
    if (runs > max) {
      runs = 0
      throw new LoopError(`Bail`)
    }
    tm = setTimeout(() => {
      runs = 0
    }, per)
  }
}
