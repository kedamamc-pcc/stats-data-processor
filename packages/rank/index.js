/*
 * Calculate the ranks
 */

const fs = require('fs-extra')
const path = require('path')
const moment = require('moment')

const boards = require('./boards')

module.exports = function calc(DATA_DIR, outputFile, config = {}) {
  const data = fs.readJsonSync(path.resolve(DATA_DIR, `day/${config.targetDate || moment().format('YYYY-MM-DD')}.json`))

  const TODAY = moment(data._update)
  const YESTERDAY = moment(TODAY).add(-1, 'day')

  const output = {
    update: TODAY.format('YYYY-MM-DD HH:mm:ss'),
    playerCount: data.players.filter(player => !player.data.banned).length,
    yesterdayCount: data.players.filter(player => moment(player.data.time_last).isBetween(YESTERDAY, TODAY, 'day', '[)')).length,
    missingCount: 0,
    newbies: [],
    birthdays: [],
  }
  const rankData = {}

  function rank(player, rankKey, handler) {
    if (!rankData[rankKey]) rankData[rankKey] = [['', 0]]

    let playerName = player.data.playername
    let playerScore = handler
      ? handler(player)
      : player[rankKey.startsWith('stat.') ? 'stats' : 'data'][rankKey]

    let [leastName, leastScore] = rankData[rankKey][0]
    if (playerScore > leastScore) {
      rankData[rankKey].push([playerName, playerScore])
      rankData[rankKey] = rankData[rankKey].sort((a, b) => a[1] - b[1]).slice(-10)
    }
  }

  for (const player of data.players) {
    if (player.data.banned) continue
    // missing count
    if (player[404]) {
      output.missingCount += 1
      continue
    }

    let name = player.data.playername

    // newbies
    if (moment(player.data.time_start).isBetween(YESTERDAY, TODAY, 'day', '[)')) output.newbies.push(name)

    // birthdays
    let startMoment = moment(player.data.time_start)
    if (startMoment.get('year') !== TODAY.get('year') && startMoment.format('MMDD') === TODAY.format('MMDD')) output.birthdays.push(name)

    for (const [rankKey, options] of boards) {
      rank(player, rankKey, options.handler)
    }
  }

  output.ranks = boards.map(([key, info]) => ({
    title: info.title,
    description: info.description,
    unit: info.unit,
    players: (info.formatter ? rankData[key].map(([name, score]) => [name, info.formatter(score)]) : rankData[key]).reverse(),
  }))

  fs.outputJsonSync(outputFile, output)
}




