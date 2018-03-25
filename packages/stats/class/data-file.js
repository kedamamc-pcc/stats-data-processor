const fs = require('fs-extra')
const pako = require('pako')
const generateMode = require('./generate-mode')

class DataFile {
  constructor (file) {
    if (fs.existsSync(file)) {
      if (file && file.endsWith('.json.gz')) {
        this.raw = pako.ungzip(fs.readFileSync(file), {to: 'string'})
      } else {
        this.raw = fs.readFileSync(file, 'utf-8')
      }
    } else {
      this.raw = null
    }
  }

  generate(file, data, mode = generateMode.PLAIN_FILE) {
    const json = {
      _version: '2.2',
      _update: Date.now(),
      ...data,
    }

    /* istanbul ignore next */
    switch (mode) {
      case generateMode.COMPRESSED_FILE:
        fs.outputFileSync(file, pako.gzip(JSON.stringify(json)))
        return this
      case generateMode.PLAIN_FILE:
        fs.outputJsonSync(file, json)
        return this
      case generateMode.OBJECT:
        return json
      case generateMode.STRING:
        return JSON.stringify(json)
    }
  }
}

module.exports = DataFile
