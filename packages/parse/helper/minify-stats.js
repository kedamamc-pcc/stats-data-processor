const RE_STAT = /^stat\.(\w+)(?:(?:\.minecraft)?(\.[\w_]+))?$/
const RE_ACHIEVEMENT = /^achievement\.(.+)$/

function minify(playerStats) {
  const stats = {}
  const achievements = {}
  let hasAchievements = false

  for (const [key, val] of Object.entries(playerStats)) {
    if (RE_STAT.test(key)) {
      const tokens = RE_STAT.exec(key)
      stats[`${tokens[1]}${tokens[2] || ''}`] = val
    } else if (RE_ACHIEVEMENT.test(key)) {
      hasAchievements = true
      achievements[RE_ACHIEVEMENT.exec(key)[1]] = val
    } else {
      console.warn(`[parser] An unknown stats key was found: ${key}`)
      stats[key] = val
    }
  }

  return {
    stats,
    achievements: hasAchievements ? achievements : undefined,
  }
}

module.exports = minify
