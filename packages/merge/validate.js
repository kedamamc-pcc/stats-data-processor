const fs = require('fs-extra')
const path = require('path')

const VERSION = '2.0'

module.exports = function validate(file) {
  console.log(`Target data version: ${VERSION}`)
  console.log(`Validating file: ${file}`)

  const filename = path.basename(file, '.json')
  const data = fs.readJsonSync(file)

  if (/^\d{4}-\d\d-\d\d$/.test(filename)) {
    console.log('Detected data type: DAY')
    Day.validate(data)
  } else if (/^[0-9a-f]{32}$/.test(filename)) {
    console.log('Detected data type: PLAYER')
    Player.validate(data)
  } else if (filename === 'players') {
    console.log('Detected data type: PLAYERS')
    Players.validate(data)
  } else {
    console.warn('Unknown data type')
  }
}

class Day {
  static validate(data) {
    let result = true

    if (!data._update) console.error('`_update` is missing')
    else if (typeof data._update === 'number') console.error('`_update` is not a number')

    if (!data.world_lived) console.error('`world_lived` is missing')
    else if (typeof data.world_lived === 'number') console.error('`world_lived` is not a number')

    if (!data.players) console.error('`players` is missing')
    else if (data.players instanceof Array) console.error('`players` is not an array')

    return result
  }
}

class Player {
  static validate(data) {
    if (!data._update) console.error('`_update` is missing')
    else if (typeof data._update === 'number') console.error('`_update` is not a number')

    if (!data.stats) console.error('`stats` is missing')
  }
}

class Players {
  static validate(data) {}
}
