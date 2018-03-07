function convertPlayers(data) {
  console.log('[migrate] No changes in players.json from 2.0_a to 2.0. Task skipped.')
  return data
}

function convertPlayer(data) {
  console.log('[migrate] No changes in player/*.json from 2.0_a to 2.0. Task skipped.')
  return data
}

function convertDay(data) {
  const copy = JSON.parse(JSON.stringify(data))
  copy._update = copy.data_update
  delete copy.data_update
  return copy
}

module.exports = function (type, data) {
  switch (type.toLowerCase()) {
    case 'day': return convertDay(data)
    case 'player': return convertPlayer(data)
    case 'players': return convertPlayers(data)
    default: console.error(`[migrate] Unknown type: ${type}.`)
  }
}
