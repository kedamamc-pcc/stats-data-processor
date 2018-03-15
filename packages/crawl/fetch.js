const fs = require('fs')
const axios = require('axios')

module.exports = async function fetch(url, file, config = {}) {
  await axios.get(url, {
    responseType: 'stream',
  }).then(res => new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(file)
    ws.on('end', () => resolve())
    res.data.pipe(ws)
  }))
}
