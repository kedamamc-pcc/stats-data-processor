const fs = require('fs-extra')
const path = require('path')
const StatsFS = require('./packages/fs')

const V1_DIR = '/Volumes/HAS500/nyaa-stats-data/v1'
const DATA_DIR = './playground/output'

const db = new StatsFS(DATA_DIR)
const theInfo = {
  _version: '2.2',
}
const thePlayers = {
  _version: '2.2',
  players: [],
}

for (const fn of fs.readdirSync(V1_DIR).filter(fn => /^2017-04-\d\d\.json$/.test(fn)).sort()) {
  // Each iteration starts a day

  const file = path.join(V1_DIR, fn)
  const input = fs.readJsonSync(file)
  const dayJson = db.readSync('day/' + theInfo.last_day) || {
    _version: '2.2',
    _update: null,
    world_lived: null,
    players: [],
  }

  dayJson._update = input.update
  dayJson.world_lived = input.world_lived

  for (const p of input.players) {
    if (p[404]) continue

    const player = {
      uuid: p.data.uuid_short,
      time_lived: p.data.time_lived,
      time_last: p.data.time_last,
      banned: p.data.banned,
      stats: minifyStats(p.stats),
      advancements: p.advancements,
    }

    {
      const idx = thePlayers.players.findIndex(p => p.uuid === player.uuid)
      const found = thePlayers.players[idx]
      thePlayers.players[idx >= 0 ? idx : thePlayers.players.length] = {
        _update: input.update,
        uuid: p.data.uuid_short,
        current_name: p.data.playername,
        names: found ? mergeNames(found.names, p.data.names) : p.data.names,
        time_start: p.data.time_start,
        time_lived: p.data.time_lived,
        time_last: p.data.time_last,
        banned: p.data.banned,
      }
    }

    const idx = dayJson.players.findIndex(_p => _p.uuid === player.uuid)
    if (idx < 0) dayJson.players.push(player)
    else if (dayJson.players[idx].time_last !== player.time_last) dayJson.players[idx] = player

    // TODO: If `time_last` has no change, no need to append new data
    const playerPth = 'player/' + player.uuid
    const playerJson = db.readSync(playerPth) || {uuid: player.uuid, data: {}}
    playerJson.data[input.update] = player
    // TODO: Can be optimized by using queue
    db.writeSync(playerPth, playerJson)
  }

  const lastDay = formatDate(dayJson._update)
  theInfo.last_day = lastDay
  db.writeSync('day/' + lastDay, dayJson)
}

db.writeSync('players', thePlayers)

function minifyStats(stats) {
  return Object.entries(stats).reduce((json, [key, val]) => {
    const re = /^stat\.(\w+)\.(?:minecraft\.)?([\w_]+)$/
    if (re.test(key)) {
      const tokens = re.exec(key)
      return {...json, [`${tokens[1]}.${tokens[2]}`]: val}
    } else if (key.startsWith('stat.')) {
      return {...json, [key.slice(5)]: val}
    } else {
      if (!key.startsWith('achievement.')) {
        console.warn(`An unknown stats key was found: ${key}`)
      }
      return {[key]: val}
    }
  }, {})
}

function mergeNames(local, update) {
  if (local[0].changedToAt === update[0].changedToAt) return local
  else return update.filter(r => r.changedToAt > (local[0].changedToAt || 0)).concat(local)
}

function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 101 + '').slice(1)}-${(d.getDate() + 100 + '').slice(1)}`
}

function genPlayer(src) {
  const player = {
    uuid: src.data.uuid_short,
    name: src.data.playername,
    names: src
  }
}
