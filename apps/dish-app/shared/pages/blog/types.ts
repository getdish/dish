export type PostEntry = {
  view: () => Promise<{
    default: any
  }>
  title: string
  date: string
  author: string
  authorImage: string
  preview?: string
  private?: boolean
}
