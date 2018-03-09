const fs = require('fs-extra')
const path = require('path')

module.exports = function (inputFile, outputDir) {
  const DATE = /\d{4}-\d\d-\d\d/.exec(inputFile)[0]
  const input = fs.readJsonSync(inputFile)
  const _update = input.update

  /* Output day/*.json */
  {
    const DAY = {
      _update,
      world_lived: input.world_lived,
      players: input.players.map(p => ({
        _update,
        ...p,
      })),
    }
    fs.outputJsonSync(path.resolve(outputDir, `day/${DATE}.json`), DAY)
  }

  const PLAYERS_FILE = path.resolve(outputDir, 'players.json')
  const PLAYERS = fs.readJsonSync(PLAYERS_FILE)

  for (const p of input.players) {
    const _uuid = p.data.uuid_short

    /* Output player/*.json */
    {
      const outputFile = path.resolve(outputDir, `player/${_uuid}.json`)
      const PLAYER = fs.readJsonSync(outputFile, {throws: false}) || {
        uuid: p.data.uuid,
        uuid_short: _uuid,
        data: {},
      }
      if (!PLAYER.data[_update]) {
        PLAYER.data[_update] = input
        fs.outputJsonSync(outputFile, PLAYER)
      }
    }

    /* Output players.json */
    {
      const _idx = PLAYERS.findIndex(pd => pd.uuid_short === _uuid)
      // Because all 1.0 files are old data, so only non-exist players need to be pushed.
      if (_idx < 0) {
        PLAYERS.push(p.data)
      }
    }
  }

  fs.outputJsonSync(PLAYERS_FILE, PLAYERS)
}
