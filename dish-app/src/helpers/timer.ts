export const timer = (name: string) => {
  let first = true
  return (...args: any[]) => {
    ;(first ? console.time : console.timeLog)(name, ...args)
    first = false
  }
}
