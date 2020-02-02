import test from 'ava'

import { shiftLatLonByMetres } from '../src/utils'

test('Shifting lat/lon by metres (positive)', t => {
  const result = shiftLatLonByMetres(51, 0, 100, 100)
  t.is(result, [51.00089831528412, 0.001427437116126087])
})

test('Shifting lat/lon by metres (negative)', t => {
  const result = shiftLatLonByMetres(51, 0, -100, -100)
  t.is(result, [50.99910168471588, -0.001427437116126087])
})
