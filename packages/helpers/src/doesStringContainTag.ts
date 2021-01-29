export function doesStringContainTag(text: string, tag: any) {
  const tag_names = [tag.name, ...(tag.alternates || [])]
  for (const tag_name of tag_names) {
    let is_found = false
    try {
      const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
      is_found = regex.test(text)
    } catch (e) {
      console.log('Tag has bad characters for regex: ' + tag_name, tag.id)
      console.error(e)
      return false
    }
    if (is_found) return true
  }
  return false
}
