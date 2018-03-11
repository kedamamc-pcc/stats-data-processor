const fs = require('fs-extra')
const path = require('path')

const VERSION = '2.0'
const wm = new WeakMap()

module.exports = function validate(file) {
  console.log(`Target data version: ${VERSION}`)
  console.log(`Validating file: ${file}`)

  const filename = path.basename(file, '.json')
  const json = fs.readJsonSync(file)

  if (/^\d{4}-\d\d-\d\d$/.test(filename)) {
    console.log('Detected data type: DAY')
    dayJson(json)
  } else if (/^[0-9a-f]{32}$/.test(filename)) {
    console.log('Detected data type: PLAYER')
    playerJson(json)
  } else if (filename === 'players') {
    console.log('Detected data type: PLAYERS')
    playersJson(json)
  } else {
    console.warn('Unknown data type')
  }
}

function e(obj, msg) {
  wm.set(obj, (wm.get(obj) || 0) + 1)
  console.error(msg)
}

function dayJson(json) {
  if (!json._update) e(json, '`_update` is missing')
  else if (typeof json._update !== 'number') e(json, '`_update` is not a number')

  if (!json.world_lived) e(json, '`world_lived` is missing')
  else if (typeof json.world_lived !== 'number') e(json, '`world_lived` is not a number')

  if (!json.players) e(json, '`players` is missing')
  else if (!json.players instanceof Array) e(json, '`players` is not an array')
  else {
    for (const it of json.players) {
      player(json, it)
    }
  }

  return !wm.get(json)
}

function player(json, data) {
  if (!data._update) e(data, '`_update` is missing')
  else if (typeof data._update !== 'number') e(data, '`_update` is not a number')

  if (!data.stats) e(data, '`stats` is missing')
  else playerStats(json, data.stats)

  if (!data.advancements) e(data, '`advancements` is missing')
  else playerAdvancements(json, data.advancements)

  if (!data.data) e(data, '`data` is missing')
  else playerData(json, data.data)

  return !wm.get(data)
}

function playerStats(json, data) {}

function playerAdvancements(json, data) {}

function playerData(json, data) {}

function playerJson(json) {}

function playersJson(json) {}
