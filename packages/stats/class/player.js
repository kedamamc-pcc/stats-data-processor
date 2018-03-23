const fs = require('fs-extra')
const DataFile = require('./data-file')

class PlayerJson extends DataFile {
  constructor (file) {
    super()

    const json = fs.readJsonSync(file, {throws: false}) || {}

    this.uuid = json.uuid
    this.data = json.data || {}
  }

  merge(parsedPlayer) {
    if (!this.uuid) {
      this.uuid = parsedPlayer.data.uuid
    } else if (this.uuid !== parsedPlayer.data.uuid) {
      console.error(`Merge other uuid into player json is not allowed. Failing uuid: ${parsedPlayer.data.uuid}`)
    }

    const key = parsedPlayer.data.time_last
    if (!this.data[key]) {
      this.uuid = parsedPlayer.data.uuid
      this.data[key] = {
        time_last: parsedPlayer.data.time_last,
        time_lived: parsedPlayer.data.time_lived,
        banned: parsedPlayer.data.banned,
        stats: parsedPlayer.stats,
        achievements: parsedPlayer.achievements,
        advancements: parsedPlayer.advancements,
      }
    }

    return this
  }

  generate(file, compress) {
    const data = {
      uuid: this.uuid,
      data: this.data,
    }
    return super.generate(file, data, compress)
  }
}

module.exports = PlayerJson
