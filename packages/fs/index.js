const fs = require('fs-extra')
const path = require('path')
const pako = require('pako')

module.exports = class StatsFS {
  constructor(dataDir) {
    this.dataDir = dataDir
  }

  writeSync(pth, data) {
    const [type, name] = pth.split('/')

    // Right now only `day` and `player` data need to be compressed
    if (['day', 'player'].includes(type)) {
      const file = path.join(this.dataDir, pth + '.json.gz')
      fs.outputFileSync(file, pako.gzip(JSON.stringify(data)))
    } else {
      const file = path.join(this.dataDir, pth + '.json')
      fs.outputJsonSync(file, data)
    }
  }

  async write(...args) {
    this.writeSync(...args)
  }

  readSync(pth) {
    const [type, name] = pth.split('/')

    if (['day', 'player'].includes(type)) {
      const file = path.join(this.dataDir, pth + '.json.gz')
      const str = pako.ungzip(fs.readFileSync(file), {to: 'string'})
      return JSON.parse(str)
    } else {
      const file = path.join(this.dataDir, pth + '.json')
      return fs.readJsonSync(file)
    }
  }

  async read(...args) {
    return this.readSync(...args)
  }
}
