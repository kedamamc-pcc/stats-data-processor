const fs = require('fs-extra')
const pako = require('pako')

class DataFile {
  generate(file, data, compress) {
    const json = {
      _version: '2.2',
      _update: Date.now(),
      ...data,
    }

    if (compress) {
      fs.outputFileSync(file, pako.gzip(JSON.stringify(json)))
    } else {
      fs.outputJsonSync(file, json)
    }

    return this
  }
}

module.exports = DataFile
