export const getFuzzyMatchQuery = (searchQuery: string) => {
  return `%${searchQuery
    .split(' ')
    .map((word) => {
      if (word.lastIndexOf('s') === word.length - 1) {
        return word.slice(0, word.length - 1) + '%s'
      }
      return word
    })
    .join('%')}%`.replace(/%%+/g, '%')
}
