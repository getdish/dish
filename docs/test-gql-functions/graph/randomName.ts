export default function randomName() {
  const first = capFirst(name1[getRandomInt(0, name1.length + 1)])
  const last = capFirst(name2[getRandomInt(0, name2.length + 1)])
  return `${first} ${last}`
}

function capFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

const name1 = ['abandoned', 'able', 'absolute']
const name2 = ['people', 'history', 'way']
