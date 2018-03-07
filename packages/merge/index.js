/**
 * Data version: 2.0
 */

const fs = require('fs-extra')
const path = require('path')

module.exports = function merge(inputDir, outputDir) {
  const TMP_DIR = inputDir
  const info = fs.readJsonSync(path.resolve(TMP_DIR, 'info.json'))
  const uuids = fs.readJsonSync(path.resolve(TMP_DIR, 'players.json')).map(p => p.uuid)
  const D = new Date(info.lastUpdate)
  const DATE = `${D.getFullYear()}-${(D.getMonth() + 101 + '').slice(1)}-${(D.getDate() + 100 + '').slice(1)}`

  const PLAYERS_FILE = path.resolve(outputDir, 'players.json')
  const DAY_DIR = path.resolve(outputDir, 'day')
  const PLAYER_DIR = path.resolve(outputDir, 'player')

  const PLAYERS = fs.readJsonSync(PLAYERS_FILE, {throws: false}) || []
  const DAY = {
    _update: info.lastUpdate,
    world_lived: info.worldTime,
    players: [],
  }

  for (const uuid of uuids) {
    const input = fs.readJsonSync(path.resolve(TMP_DIR, uuid + '.json'))
    let needUpdate = null

    /**
     * Write to player/*.json
     */
    {
      const file = path.resolve(PLAYER_DIR, input.data.uuid_short + '.json')
      const json = fs.pathExistsSync(file) ? fs.readJsonSync(file) : {
        uuid: input.data.uuid,
        uuid_short: input.data.uuid_short,
        data: {},
      }
      if (!json.data[input.data.lastUpdate]) {
        json.data[input.data.lastUpdate] = {
          ...input,
          _update: input.data.lastUpdate,
        }
        fs.outputJsonSync(file, json)
        needUpdate = true
      } else {
        needUpdate = false
      }
    }

    /**
     * Write to players.json
     */
    if (needUpdate) {
      // Find player from exist players.json
      const idx = PLAYERS.findIndex(p => p.uuid_short === uuid)
      // If found, replace the data
      if (idx >= 0) {
        PLAYERS[idx] = input.data
        // If not, append new data
      } else {
        PLAYERS.push(input.data)
      }
    }

    /**
     * Write to day/*.json
     * Because this file is the final state of all players, so every data needs to be contained.
     */
    {
      DAY.players.push(input)
    }
  }

  fs.outputJsonSync(PLAYERS_FILE, PLAYERS)
  fs.outputJsonSync(path.resolve(DAY_DIR, DATE + '.json'), DAY)
}
