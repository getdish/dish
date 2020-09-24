// @ts-nocheck

const sets = [
  { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
  { to: 'c', from: '[ÇĆĈČ]' },
  { to: 'd', from: '[ÐĎĐÞ]' },
  { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
  { to: 'g', from: '[ĜĞĢǴ]' },
  { to: 'h', from: '[ĤḦ]' },
  { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
  { to: 'j', from: '[Ĵ]' },
  { to: 'ij', from: '[Ĳ]' },
  { to: 'k', from: '[Ķ]' },
  { to: 'l', from: '[ĹĻĽŁ]' },
  { to: 'm', from: '[Ḿ]' },
  { to: 'n', from: '[ÑŃŅŇ]' },
  { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
  { to: 'oe', from: '[Œ]' },
  { to: 'p', from: '[ṕ]' },
  { to: 'r', from: '[ŔŖŘ]' },
  { to: 's', from: '[ßŚŜŞŠ]' },
  { to: 't', from: '[ŢŤ]' },
  { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
  { to: 'w', from: '[ẂŴẀẄ]' },
  { to: 'x', from: '[ẍ]' },
  { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
  { to: 'z', from: '[ŹŻŽ]' },
  { to: '-', from: "[·/_,:;']" },
]

const cache = new Map()

export function slugify(text: string, separator = '-') {
  if (cache.has(text)) {
    return cache.get(text)
  }
  let next = text.toString().toLowerCase().trim()

  sets.forEach((set) => {
    next = next.replace(new RegExp(set.from, 'gi'), set.to)
  })

  next = next
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

  if (typeof separator !== 'undefined' && separator !== '-') {
    next = next.replace(/-/g, separator)
  }

  if (next == '') {
    next = `no-slug`
    console.warn('no slug')
  }

  cache.set(text, next)
  if (cache.size > 300) {
    // memory leak prevent
    cache.clear()
  }
  return next
}
