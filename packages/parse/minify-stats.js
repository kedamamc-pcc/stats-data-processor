const RE_STAT = /^stat\.(\w+)(?:\.(?:minecraft\.)?([\w_]+))?$/
const RE_ACHIEVEMENT = /^achievement\.(.+)$/

function minify(playerStats) {
  const stats = {}
  const achievements = {}

  for (const [key, val] of Object.entries(playerStats)) {
    if (RE_STAT.test(key)) {
      const tokens = RE_STAT.exec(key)
      stats[`${tokens[1]}${tokens[2] || ''}`] = val
    } else if (RE_ACHIEVEMENT.test(key)) {
      achievements[RE_ACHIEVEMENT.exec(key)[1]] = val
    } else {
      console.warn(`An unknown stats key was found: ${key}`)
    }
  }

  return {
    stats,
    achievements,
  }
}

module.exports = minify
