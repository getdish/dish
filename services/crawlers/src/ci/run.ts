import { CI } from './CI'

async function main() {
  const ue = new CI()
  await ue.runOnWorker('doIt', ['It is done'])
}

main()
