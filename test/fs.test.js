const fs = require('fs-extra')
const StatsFS = require('../packages/fs')

const DATA_DIR = '../playground/tmp'

const statsFS = new StatsFS(DATA_DIR)
const data = {val: Math.random()}

;(async function () {
  fs.emptyDirSync(DATA_DIR)

  console.log('Writing')
  await statsFS.write('day/test', data)
  console.log('Reading')
  const _data = await statsFS.read('day/test')

  if (_data.val === data.val) {
    console.log('OK!')
  } else {
    console.log('No! I got ' + _data)
  }
})().then(_ => {
  fs.removeSync(DATA_DIR)
})
