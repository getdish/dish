export function doesStringContainTag(text: string, tag: any) {
  const normalized = text.normalize().replace(/[\u0300-\u036f]/g, '')
  const names = [tag.name, ...(tag.alternates || [])]
  for (const name of names) {
    try {
      const regex = new RegExp(`\\b${name}\\b`, 'i')
      if (regex.test(normalized)) {
        return true
      }
    } catch (e) {
      console.log('Tag has bad characters for regex: ' + name, tag.id)
      console.error(e)
    }
  }
  return false
}
