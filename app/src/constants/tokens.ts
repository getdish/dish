import { darkColorsPostfixed, light } from './colors'
import { isWeb } from './constants'
import { createFont, createTokens } from 'tamagui'

const size = {
  0: 0,
  1: 4,
  2: 8,
  3: 14,
  4: 18,
  5: 24,
  6: 32,
  7: 44,
  8: 56,
  9: 78,
  10: 100,
  true: 10,
}

const space = {
  ...size,
  '-0': -0,
  '-1': -5,
  '-2': -10,
  '-3': -15,
  '-4': -20,
  '-5': -25,
  '-6': -30,
  '-7': -40,
  '-8': -50,
  '-9': -75,
  '-10': -100,
}

const interFont = createFont({
  family: isWeb
    ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    : 'Inter',
  size: {
    1: 10,
    2: 12,
    3: 14,
    4: 15,
    5: 17,
    6: 18,
    7: 22,
    8: 28,
    9: 38,
    10: 44,
    11: 68,
    12: 76,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 22,
    6: 24,
    7: 26,
    8: 30,
    9: 42,
    10: 46,
    11: 75,
    12: 88,
  },
  weight: {
    4: '300',
    7: '600',
    8: '700',
  },
  letterSpacing: {
    4: 0,
    7: -1,
    9: -2,
    10: -3,
    12: -4,
  },
})

const monoFont = createFont({
  family: 'Monospace',
  size: {
    1: 10,
    2: 11,
    3: 12,
    4: 13,
    5: 16,
    6: 18,
  },
  lineHeight: {
    1: 15,
    2: 20,
    3: 22,
    4: 23,
    5: 24,
    6: 26,
  },
  weight: {
    4: '300',
    6: '700',
  },
  letterSpacing: {
    4: 0,
  },
})

export const tokens = createTokens({
  size,
  space,
  font: {
    title: interFont,
    body: interFont,
    mono: monoFont,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    ...light,
    ...darkColorsPostfixed,
  },
  radius: {
    0: 0,
    1: 3,
    2: 5,
    3: 10,
    4: 15,
    5: 20,
  },
})
