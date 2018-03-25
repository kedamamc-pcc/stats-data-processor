const fs = require('fs-extra')
const path = require('path')
const url = require('url')
const fetch = require('./fetch')

module.exports = async function (origin, tmpDir, dataDir) {
  log('Target NyaaStats version: 2.0')

  log('Downloading info.json')
  const infoFile = path.join(tmpDir, 'info.json')
  await fetch(url.resolve(origin, '/static/data/info.json'), infoFile)
  const infoJson = fs.readJsonSync(infoFile)

  const _infoJson = dataDir && fs.readJsonSync(path.join(dataDir, 'info.json'))
  if (!_infoJson || infoJson.lastUpdate <= _infoJson._update) {
    log(`No updates found from ${origin}`)
    return
  }

  log('Downloading players.json')
  const playersFile = path.join(tmpDir, 'players.json')
  await fetch(url.resolve(origin, '/static/data/players.json'), playersFile)
  const playersJson = fs.readJsonSync(playersFile)

  const _playersJson = fs.readJsonSync(path.join(dataDir, 'players.json'))
  const playersDiff = playersJson.filter(p => p.seen >= _infoJson._update)

  for (const p of playersJson) {
    const uuid = p.uuid
    await fetch(url.resolve(origin, `/static/data/${uuid}/stats.json`), path.resolve(tmpDir, uuid + '.json'))
  }

  /**********************************************************************************************/

  let playersAttempt = 0;
  let playersSuccess = false;
  while (++playersAttempt <= config.retry) {
    try {
      await fetch(url.resolve(ORIGIN, '/static/data/players.json'), path.resolve(TMP_DIR, 'players.json'));
      await fetch(url.resolve(ORIGIN, '/static/data/info.json'), path.resolve(TMP_DIR, 'info.json'))
      playersSuccess = true;
      break;
    } catch (e) {
      console.warn('Fetch players data failed');
    }
  }
  if (!playersSuccess) {
    console.error('Fetching players data failed too many times');
    process.exit(1);
  }

  let playersData = read(path.resolve(TMP_DIR, 'players.json'));
  console.log(`${playersData.length} players in total`);

  let uuids = playersData.map(p => p.uuid)
  let failedUuids = new Map();
  for (const uuid of uuids) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      await fetch(url.resolve(ORIGIN, `/static/data/${uuid}/stats.json`), path.resolve(TMP_DIR, `${uuid}.json`));
      if (failedUuids.has(uuid)) {
        failedUuids.delete(uuid);
      }
    } catch (e) {
      console.warn(e.message);
      failedUuids.set(uuid, failedUuids.has(uuid) ? failedUuids.get(uuid) + 1 : 1);
      if (failedUuids.get(uuid) < config.retry) {
        uuids.push(uuid);
      }
    }
  }

  if (failedUuids.size) {
    console.warn('Failed UUIDs:\n' + Array.from(failedUuids.keys()).join('\n'));
  }

  const fileCount = fs.readdirSync(TMP_DIR).length
  if (playersData.length + 2 !== fileCount) {
    console.log(`Should be ${playersData.length.length + 2} files but found ${fileCount} files`)
    process.exit(1)
  }

  // merge(TMP_DIR, config.merged_dir);
}

function log(msg) {
  console.log(`[crawl] ${msg}`)
}
