import fetch from 'node-fetch'

/**
 *   using http://overpass-turbo.eu
 *   example query:
 *
 *  [out:json][timeout:25];
 *  (
 *    node[\"amenity\"=\"restaurant\"](21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);
 *    way[\"amenity\"=\"restaurant\"](21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);
 *    relation[\"amenity\"=\"restaurant\"](21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);
 *  );
 *  out body;
 *  >;
 *  out skel qt;
 *
 *
 *  http://overpass-api.de/api/interpreter?data=%5Bout:json%5D%5Btimeout:100%5D;%0A(%0A%20%20node%5B%22amenity%22%3D%22restaurant%22%5D(21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);%0A%20%20way%5B%22amenity%22%3D%22restaurant%22%5D(21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);%0A%20%20relation%5B%22amenity%22%3D%22restaurant%22%5D(21.38942705899535,-157.7446711063385,21.398267824472033,-157.73684978485107);%0A);%0Aout%20body;%0A%3E;%0Aout%20skel%20qt;
 *
 **/

type Props = {
  lat: number
  lng: number
  span: number
  timeout: number
}

async function main({ lat, lng, span, timeout }: Props) {
  const half = span / 2
  const [a, b, c, d] = [lat - half, lng - half, lat + half, lng + half]
  const bbox = `${a},${b},${c},${d}`
  const dataStr = `
[out:json][timeout:${timeout}];
(
  node[\"amenity\"=\"restaurant\"](${bbox});
  way[\"amenity\"=\"restaurant\"](${bbox});
  relation[\"amenity\"=\"restaurant\"](${bbox});
);
out body;
>;
out skel qt;
`
  const data = encodeURIComponent(dataStr.trim())
  const url = `http://overpass-api.de/api/interpreter?data=${data}`
  console.log('\nfetching', url, '\n', 'using data\n', dataStr, '\n')
  const json = await fetch(url).then((res) => res.json())
  console.log('got', JSON.stringify(json, null, 2))

  // osm2pgsql -H localhost -s -U geobox -d geotuga -c rome.osm
}

const [lat, lng, span, timeout] = getEnvOrArg('--lat', '--lng', '--span', '--timeout')
console.log([lat, lng, span, timeout])

main({
  lat: +lat!,
  lng: +lng!,
  span: +span!,
  timeout: timeout ? +timeout : 50,
})

// for dev it should quit background jobs better
const cleanExit = () => {
  console.log('clean exit')
  process.exit(0)
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

function getEnvOrArg(...args: string[]) {
  return args.map((arg) => {
    const env = process.env[arg.replace('--', '').toUpperCase()]
    if (env) return env
    const argIndex = process.argv.indexOf(arg)
    if (argIndex === -1) return
    return process.argv[argIndex + 1]
  })
}
