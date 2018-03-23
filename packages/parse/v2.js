const fs = require('fs-extra')
const path = require('path')
const minify = require('./minify-stats')

function parseV2 (dir) {
  const infoJson = fs.readJsonSync(path.join(dir, 'info.json'))

  return {
    _version: '2.2',
    world: {
      time_lived: infoJson.worldTime,
    },
    players: fs.readdirSync(dir)
      .filter(fn => /^[0-9a-f]{32}\.json$/.test(fn))
      .map(fn => {
        const p = fs.readJsonSync(path.join(dir, fn))

        return {
          data: {
            uuid: p.data.uuid_short,
            name: p.data.playername,
            names: p.data.names,
            time_start: p.data.time_start,
            time_last: p.data.time_last,
            time_lived: p.data.time_lived,
            banned: p.data.banned,
          },
          ...minify(p.stats),
          advancements: p.advancements,
        }
      }),
  }
}

module.exports = parseV2
