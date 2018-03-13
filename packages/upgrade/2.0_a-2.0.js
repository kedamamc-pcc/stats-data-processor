const fs = require('fs-extra')
const path = require('path')

module.exports = function convert(inputFile, outputDir) {
  const filename = path.basename(inputFile, '.json')
  const data = fs.readJsonSync(inputFile)

  if (/^\d{4}-\d\d-\d\d$/.test(filename)) {
    console.log(`Reading: ${inputFile} (Detected as day/*.json)`)
    data._update = data.data_update
    delete data.data_update
    const outputFile = path.resolve(outputDir, `day/${filename}.json`)
    fs.outputJsonSync(outputFile, data)
    console.log(`Output file: ${outputFile}`)
  } else if (/^[0-9a-f]{32}$/.test(filename)) {
    console.log('Detected type: player/*.json')
    console.log('No changes in player/*.json from 2.0_a to 2.0. Task skipped.')
  } else if (filename === 'players') {
    console.log('Detected type: players.json')
    console.log('No changes in players.json from 2.0_a to 2.0. Task skipped.')
  } else {
    console.warn('Unknown data type')
  }
}
