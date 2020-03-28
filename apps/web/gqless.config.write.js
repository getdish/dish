const { writeFile } = require('fs')
const getGraphEndpoint = require('@dish/common-web').getGraphEndpoint

writeFile(
  './gqless.config.json',
  JSON.stringify(
    {
      url: getGraphEndpoint(),
      outputDir: 'src/graphql',
    },
    null,
    2
  ),
  (val, err) => {
    console.log('ran', val, err)
  }
)
