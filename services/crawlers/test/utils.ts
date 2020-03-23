import test from 'ava'

import {
  shiftLatLonByMetres,
  aroundCoords,
  boundingBoxFromcenter,
} from '../src/utils'

test('Shifting lat/lon by metres (positive)', (t) => {
  const result = shiftLatLonByMetres(51, 0, 100, 100)
  t.deepEqual(result, [51.00089831528412, 0.001427437116126087])
})

test('Shifting lat/lon by metres (negative)', (t) => {
  const result = shiftLatLonByMetres(51, 0, -100, -100)
  t.deepEqual(result, [50.99910168471588, -0.001427437116126087])
})

test('Generating array of coords around a center', (t) => {
  const result = aroundCoords(51, 0, 30000, 2)
  t.is(result.length, 9)
  t.deepEqual(result[0], [51.269494585235854, -0.4282311348378261])
  t.deepEqual(result[4], [51, 0])
  t.deepEqual(result[8], [50.730505414764146, 0.4282311348378261])
})

test('Generating bounding box', (t) => {
  const result = boundingBoxFromcenter(51, 0, 100)
  t.is(result.length, 2)
  t.deepEqual(result[0], [51.00089831528412, 0.001427437116126087])
  t.deepEqual(result[1], [50.99910168471588, -0.001427437116126087])
})
