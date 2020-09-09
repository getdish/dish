// TODO replace with flexsearch light

const SEQUENTIAL_BONUS = 15 // bonus for adjacent matches
const SEPARATOR_BONUS = 30 // bonus if match occurs after a separator
const CAMEL_BONUS = 30 // bonus if match is uppercase and prev is lower
const FIRST_LETTER_BONUS = 15 // bonus if the first letter is matched

const LEADING_LETTER_PENALTY = -5 // penalty applied for every letter in str before the first match
const MAX_LEADING_LETTER_PENALTY = -15 // maximum penalty for leading letters
const UNMATCHED_LETTER_PENALTY = -1

/**
 * Returns true if each character in pattern is found sequentially within str
 */
export function fuzzyMatchSimple(pattern: string, str: string) {
  let patternIdx = 0
  let strIdx = 0
  const patternLength = pattern.length
  const strLength = str.length

  while (patternIdx != patternLength && strIdx != strLength) {
    const patternChar = pattern.charAt(patternIdx).toLowerCase()
    const strChar = str.charAt(strIdx).toLowerCase()
    if (patternChar == strChar) ++patternIdx
    ++strIdx
  }

  return patternLength != 0 && strLength != 0 && patternIdx == patternLength
    ? true
    : false
}

/**
 * Does a fuzzy search to find pattern inside a string.
 */
function fuzzyMatch(pattern: string, str: string): [boolean, number] {
  const recursionCount = 0
  const recursionLimit = 10
  const matches = []
  const maxMatches = 256

  return fuzzyMatchRecursive(
    pattern,
    str,
    0,
    0,
    null,
    matches,
    maxMatches,
    0 /* nextMatch */,
    recursionCount,
    recursionLimit
  )
}

function fuzzyMatchRecursive(
  pattern: string,
  str: string,
  patternCurIndex: number,
  strCurrIndex: number,
  srcMatches,
  matches,
  maxMatches,
  nextMatch,
  recursionCount,
  recursionLimit
): [boolean, number] {
  let outScore = 0

  // Return if recursion limit is reached.
  if (++recursionCount >= recursionLimit) {
    return [false, outScore]
  }

  // Return if we reached ends of strings.
  if (patternCurIndex === pattern.length || strCurrIndex === str.length) {
    return [false, outScore]
  }

  // Recursion params
  let recursiveMatch = false
  let bestRecursiveMatches = []
  let bestRecursiveScore: number | boolean = 0
  let recursiveMatches = []

  // Loop through pattern and str looking for a match.
  let firstMatch = true
  while (patternCurIndex < pattern.length && strCurrIndex < str.length) {
    // Match found.
    if (
      pattern[patternCurIndex].toLowerCase() === str[strCurrIndex].toLowerCase()
    ) {
      if (nextMatch >= maxMatches) {
        return [false, outScore]
      }

      if (firstMatch && srcMatches) {
        matches = [...srcMatches]
        firstMatch = false
      }

      recursiveMatches = []
      const [matched, recursiveScore] = fuzzyMatchRecursive(
        pattern,
        str,
        patternCurIndex,
        strCurrIndex + 1,
        matches,
        recursiveMatches,
        maxMatches,
        nextMatch,
        recursionCount,
        recursionLimit
      )

      if (matched) {
        // Pick best recursive score.
        if (!recursiveMatch || recursiveScore > bestRecursiveScore) {
          bestRecursiveMatches = [...recursiveMatches]
          bestRecursiveScore = recursiveScore
        }
        recursiveMatch = true
      }

      matches[nextMatch++] = strCurrIndex
      ++patternCurIndex
    }
    ++strCurrIndex
  }

  const matched = patternCurIndex === pattern.length

  if (matched) {
    outScore = 100

    // Apply leading letter penalty
    let penalty = LEADING_LETTER_PENALTY * matches[0]
    penalty =
      penalty < MAX_LEADING_LETTER_PENALTY
        ? MAX_LEADING_LETTER_PENALTY
        : penalty
    outScore += penalty

    //Apply unmatched penalty
    const unmatched = str.length - nextMatch
    outScore += UNMATCHED_LETTER_PENALTY * unmatched

    // Apply ordering bonuses
    for (let i = 0; i < nextMatch; i++) {
      const currIdx = matches[i]

      if (i > 0) {
        const prevIdx = matches[i - 1]
        if (currIdx == prevIdx + 1) {
          outScore += SEQUENTIAL_BONUS
        }
      }

      // Check for bonuses based on neighbor character value.
      if (currIdx > 0) {
        // Camel case
        const neighbor = str[currIdx - 1]
        const curr = str[currIdx]
        if (
          neighbor === neighbor.toLowerCase() &&
          curr === curr.toUpperCase()
        ) {
          outScore += CAMEL_BONUS
        }
        const isNeighbourSeparator = neighbor == '_' || neighbor == ' '
        if (isNeighbourSeparator) {
          outScore += SEPARATOR_BONUS
        }
      } else {
        // First letter
        outScore += FIRST_LETTER_BONUS
      }
    }

    // Return best result
    if (recursiveMatch && (!matched || bestRecursiveScore > outScore)) {
      // Recursive score is better than "this"
      matches = [...bestRecursiveMatches]
      outScore = +bestRecursiveScore
      return [true, outScore]
    } else if (matched) {
      // "this" score is better than recursive
      return [true, outScore]
    } else {
      return [false, outScore]
    }
  }
  return [false, outScore]
}

/**
 * Strictly optional utility to help make using fts_fuzzy_match easier for large data sets
 * Uses setTimeout to process matches before a maximum amount of time before sleeping
 */
function fuzzyMatchAsync(
  matchFn: Function,
  pattern: string,
  dataSet: any[],
  keys: string[],
  onComplete: Function
) {
  const ITEMS_PER_CHECK = 1000 // performance.now can be very slow depending on platform
  const matchedIndices: number[] = []
  let max_ms_per_frame = 1000.0 / 30.0 // 30FPS
  let dataIndex = 0
  let resumeTimeout: any = null

  // Perform matches for at most max_ms
  function step() {
    clearTimeout(resumeTimeout)
    resumeTimeout = null
    const stopTime = performance.now() + max_ms_per_frame

    for (; dataIndex < dataSet.length; ++dataIndex) {
      if (dataIndex % ITEMS_PER_CHECK == 0) {
        if (performance.now() > stopTime) {
          resumeTimeout = setTimeout(step, 1)
          return
        }
      }

      for (const key of keys) {
        const str = dataSet[dataIndex][key]
        if (!str) {
          console.warn('no key!', key)
          continue
        }
        const result = matchFn(pattern, str)
        // A little gross because fuzzy_match_simple and fuzzy_match return different things
        if (matchFn == fuzzyMatchSimple && result == true) {
          matchedIndices.push(dataIndex)
        } else if (matchFn == fuzzyMatch && result[0] == true) {
          matchedIndices.push(dataIndex)
        }
      }
    }

    onComplete(matchedIndices)
    return null
  }

  step()
}

export function fuzzyFindIndices<A extends any[]>(
  needle: string,
  haystack: A,
  keys: string[] = ['name']
): Promise<number[]> {
  return new Promise((res, rej) => {
    try {
      fuzzyMatchAsync(fuzzyMatch, needle, haystack, keys, res)
    } catch (err) {
      rej(err)
    }
  })
}

export async function fuzzyFind<A extends any>(
  needle: string,
  haystack: A[],
  keys: string[] = ['name']
): Promise<A[]> {
  const indices = await fuzzyFindIndices(needle, haystack, keys)
  return indices.map((i) => haystack[i])
}

export function fuzzyFindSync<A extends any>(
  needle: string,
  haystack: A[],
  keys: string[] | null = ['name']
): A[] {
  const found: A[] = []
  for (const item of haystack) {
    if (!keys) {
      if (fuzzyMatch(item as any, needle)[0] === true) {
        found.push(item)
      }
    } else {
      for (const key of keys) {
        if (fuzzyMatch(item[key], needle)[0] === true) {
          found.push(item)
        }
      }
    }
  }
  return found
}
