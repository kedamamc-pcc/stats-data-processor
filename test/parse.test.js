const test = require('ava')
const fs = require('fs-extra')
const path = require('path')
const parseV1 = require('../packages/parse/v1')
const parseV2 = require('../packages/parse/v2')

const MOCK = path.resolve(__dirname, '__mock__')

test('v1 parser', t => {
  t.is(
    JSON.stringify(parseV1(path.join(MOCK, 'v1/day1.json')), null, 2),
    JSON.stringify(fs.readJsonSync(path.join(MOCK, 'v1/day1.parsed.json')), null, 2),
  )
})

test('v2 parser', t => {
  t.is(
    JSON.stringify(parseV2(path.join(MOCK, 'v2/day1')), null, 2),
    JSON.stringify(fs.readJsonSync(path.join(MOCK, 'v2/day1.parsed.json')), null, 2),
  )
})
