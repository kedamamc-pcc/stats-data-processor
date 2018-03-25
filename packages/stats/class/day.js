const DataFile = require('./data-file')

class DayJson extends DataFile {
  constructor (file) {
    super(file)

    const json = JSON.parse(this.raw) || {}
    delete this.raw

    this.world_lived = json.world_lived || 0
    this.players = json.players || []
  }

  merge(parsedData) {
    this.world_lived = parsedData.world.world_lived

    for (const parsed of parsedData.players) {
      const record = {
        uuid: parsed.data.uuid,
        time_last: parsed.data.time_last,
        time_lived: parsed.data.time_lived,
        banned: parsed.data.banned,
        stats: parsed.stats,
        achievements: parsed.achievements,
        advancements: parsed.advancements,
      }

      const idx = this.players.findIndex(p => p.uuid === record.uuid)
      if (idx < 0) {
        this.players.push(record)
      } else {
        this.players[idx] = record
      }
    }

    return this
  }

  generate(file, compress) {
    const data = {
      world_lived: this.world_lived,
      players: this.players
    }
    return super.generate(file, data, compress)
  }
}

module.exports = DayJson
