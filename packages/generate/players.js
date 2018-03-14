const fs = require('fs-extra')
const path = require('path')

const RE_UUID = /^[0-9a-f]{32}\.json$/
const PLAYERS = []
const MAP = {}

// Process v2 data
{
  const DIR = '/Volumes/HAS500/nyaa-stats-data/v2'
  const dirs = fs.readdirSync(DIR).filter(fn => /^\d{4}$/.test(fn)).reverse()

  for (const dir of dirs) {
    const filenames = fs.readdirSync(path.resolve(DIR, dir)).filter(fn => RE_UUID.test(fn))
    for (const fn of filenames) {
      const json = fs.readJsonSync(path.resolve(DIR, dir, fn))
      const uuid = json.data.uuid_short
      if (!MAP[uuid] && !json[404]) {
        PLAYERS.push(makePlayerData(json.data))
        MAP[uuid] = true
      }
    }
  }
}

// Process v1 data
{
  const DIR = '/Volumes/HAS500/nyaa-stats-data/v1'
  const filenames = fs.readdirSync(path.resolve(DIR)).filter(fn => /^\d{4}-\d\d-\d\d\.json$/.test(fn) && fn !== '2018-02-21.json').reverse()

  for (const fn of filenames) {
    const json = fs.readJsonSync(path.resolve(DIR, fn))

    for (const p of json.players) {
      const uuid = p.data.uuid_short
      if (!MAP[uuid] && !p[404]) {
        PLAYERS.push(makePlayerData(p.data))
        MAP[uuid] = true
      }
    }
  }
}

console.log('Player count: ' + PLAYERS.length)
fs.outputJsonSync('../../playground/output/players.json', PLAYERS)

function makePlayerData({uuid, uuid_short, playername, names, time_start, time_last, time_lived, banned}) {
  return {
    uuid,
    uuid_short,
    playername,
    names,
    time_start,
    time_last,
    time_lived,
    banned,
  }
}
