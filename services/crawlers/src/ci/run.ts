import { CI } from './CI'

async function main() {
  const ue = new CI()
  await ue.run_on_worker('doIt', {
    message: 'It is done',
  })
}

main()
