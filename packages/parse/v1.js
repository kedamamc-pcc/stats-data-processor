const fs = require('fs-extra')
const minify = require('./minify-stats')

function parseV1(file) {
  const json = fs.readJsonSync(file)

  return {
    _version: '2.2',
    world: {
      world_lived: json.world_lived,
    },
    players: json.players.filter(p => !p[404]).map(p => ({
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
    })),
  }
}

module.exports = parseV1
