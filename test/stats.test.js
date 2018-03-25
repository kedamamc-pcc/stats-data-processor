const test = require('ava')
const fs = require('fs-extra')
const path = require('path')
const parseV1 = require('../packages/parse/v1')
const parseV2 = require('../packages/parse/v2')
const PlayersJson = require('../packages/stats/class/players')
const DayJson = require('../packages/stats/class/day')
const PlayerJson = require('../packages/stats/class/player')
const modes = require('../packages/stats/class/generate-mode')

const MOCK = path.resolve(__dirname, '__mock__')
const v1_day1 = parseV1(path.join(MOCK, 'v1/day1.json'))
const v2_day1 = parseV2(path.join(MOCK, 'v2/day1'))

test('day', t => {
  const dayJson = new DayJson()
  dayJson.merge(v1_day1)
  dayJson.merge(v2_day1)

  const generated = dayJson.generate(null, modes.OBJECT)
  const expected = fs.readJsonSync(path.join(MOCK, 'expected/day.expected.json'))
  expected._update = generated._update

  t.is(
    JSON.stringify(generated, null, 2),
    JSON.stringify(expected, null, 2),
  )
})

test('players', t => {
  const playersJson = new PlayersJson()
  playersJson.merge(v1_day1.players.map(p => p.data))
  playersJson.merge(v2_day1.players.map(p => p.data))

  const generated = playersJson.generate(null, modes.OBJECT)
  const expected = fs.readJsonSync(path.join(MOCK, 'expected/players.expected.json'))
  expected._update = generated._update

  t.is(
    JSON.stringify(generated, null, 2),
    JSON.stringify(expected, null, 2),
  )
})

test('player', t => {
  const playerJson = new PlayerJson()
  for (const p of [].concat(v1_day1.players, v2_day1.players)) {
    playerJson.merge(p)
  }

  const generated = playerJson.generate(null, modes.OBJECT)
  const expected = fs.readJsonSync(path.join(MOCK, 'expected/player/eac8b3962e8e4fb88cf3cb249c536ba6.expected.json'))
  expected._update = generated._update

  t.is(
    JSON.stringify(generated, null, 2),
    JSON.stringify(expected, null, 2),
  )
})
