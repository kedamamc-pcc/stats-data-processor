const fs = require('fs-extra')
const DataFile = require('./data-file')

class PlayersJson extends DataFile {
  constructor (file) {
    super()

    const json = fs.readJsonSync(file, {throws: false}) || {}

    this.players = json.players || []
  }

  merge(parsedPlayerData) {
    for (const parsed of [].concat(parsedPlayerData)) {
      const idx = this.players.findIndex(p => p.uuid === parsed.data.uuid)
      if (idx < 0) {
        this.players.push(parsed.data)
      } else {
        const found = this.players[idx]
        this.players[idx] = {
          ...parsed.data,
          names: mergeNames(found.names, parsed.data.names),
        }
      }
    }

    return this
  }

  generate(file, compress) {
    return super.generate(file, {players: this.players}, compress)
  }
}

function mergeNames(local, update) {
  if (local[0].changedToAt === update[0].changedToAt) return local
  else return update.filter(r => r.changedToAt > (local[0].changedToAt || 0)).concat(local)
}

module.exports = PlayersJson
