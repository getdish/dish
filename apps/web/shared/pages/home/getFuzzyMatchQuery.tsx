export const getFuzzyMatchQuery = (searchQuery: string) => {
  return `%${searchQuery.split(' ').join('%')} %`.replace(/%%+/g, '%')
}
