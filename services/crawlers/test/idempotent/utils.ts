import test from 'ava'

import {
  aroundCoords,
  boundingBoxFromcenter,
  shiftLatLonByMetres,
} from '../../src/utils'

test('Shifting lat/lon by metres (positive)', (t) => {
  const result = shiftLatLonByMetres(51, 0, 100, 100)
  t.deepEqual(result, [51.00089831528412, 0.0014274371161260872])
})

test('Shifting lat/lon by metres (negative)', (t) => {
  const result = shiftLatLonByMetres(51, 0, -100, -100)
  t.deepEqual(result, [50.99910168471588, -0.0014274371161260872])
})

test('Generating array of coords around a center', (t) => {
  const result = aroundCoords(51, 0, 30000, 2)
  t.is(result.length, 25)
  t.deepEqual(result[0], [51.538989170471716, -0.8564622696756522])
  t.deepEqual(result[12], [51, 0])
  t.deepEqual(result[24], [50.461010829528284, 0.8564622696756522])
})

test('Generating bounding box', (t) => {
  const result = boundingBoxFromcenter(51, 0, 100)
  t.is(result.length, 2)
  t.deepEqual(result[0], [51.00089831528412, 0.0014274371161260872])
  t.deepEqual(result[1], [50.99910168471588, -0.0014274371161260872])
})
