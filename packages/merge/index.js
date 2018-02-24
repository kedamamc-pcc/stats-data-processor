const fs = require('fs-extra')
const path = require('path')

module.exports = function merge(inputDir, outputDir) {
  const PLAYERS_FILE = path.resolve(outputDir, 'players.json')
  const DAY_DIR = path.resolve(outputDir, 'day')
  const PLAYER_DIR = path.resolve(outputDir, 'player')

  fs.ensureDirSync(DAY_DIR)
  fs.ensureDirSync(PLAYER_DIR)

  const TMP_DIR = inputDir
  const info = fs.readJsonSync(path.resolve(TMP_DIR, 'info.json'))
  const uuids = fs.readJsonSync(path.resolve(TMP_DIR, 'players.json')).map(p => p.uuid)

  const D = new Date(info.lastUpdate)
  const DATE = `${D.getFullYear()}-${(D.getMonth() + 101 + '').slice(1)}-${(D.getDate() + 100 + '').slice(1)}`

  const outputs = {
    players: fs.pathExistsSync(PLAYERS_FILE) ? fs.readJsonSync(PLAYERS_FILE) : [],
    day: {
      world_time: info.worldTime,
      data_update: info.lastUpdate,
      players: [],
    },
  }

  for (const uuid of uuids) {
    const data = fs.readJsonSync(path.resolve(TMP_DIR, uuid + '.json'))
    let hasUpdate = false

    // write players.json
    {
      const idx = outputs.players.findIndex(p => p.uuid_short === uuid)
      if (idx >= 0) {
        if (outputs.players[idx].seen < data.data.seen) {
          hasUpdate = true
        }
        if (outputs.players[idx].lastUpdate < data.data.lastUpdate) {
          outputs.players[idx] = data.data
        }
      } else {
        outputs.players.push(data.data)
        hasUpdate = true
      }
    }

    // write player/xxxx.json
    if (hasUpdate) {
      const file = path.resolve(PLAYER_DIR, uuid + '.json')
      const json = fs.pathExistsSync(file) ? fs.readJsonSync(file) : {
        uuid: data.data.uuid,
        uuid_short: data.data.uuid_short,
        data: {},
      }
      json.data[data.data.lastUpdate] = data
      fs.outputJsonSync(file, json)
    }

    // write day/xxxx-xx-xx.json
    {
      outputs.day.players.push(data)
    }
  }

  fs.outputJsonSync(PLAYERS_FILE, outputs.players)
  fs.outputJsonSync(path.resolve(DAY_DIR, DATE + '.json'), outputs.day)
}
