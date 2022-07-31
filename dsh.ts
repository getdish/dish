#!/usr/bin/env zx

export {}

async function run(command: string) {
  console.log(`$ yarn dsh`, command)
  switch (command) {
    case 'test': {
      const { test } = require('./bin/test')
      await test()
    }
  }
}

try {
  await run(process.argv[1])
  process.exit(0)
} catch (err) {
  console.log(err.message)
}
