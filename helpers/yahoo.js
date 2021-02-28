
const YahooFantasy = require('yahoo-fantasy')
const fs = require('fs')

const gameKeys = {
  '2021': '404',
  '2020': '398',
  '2019': '388'
}
const leagueKeys = {
  '2020': '398.l.28264',
  '2019': '388.l.111208'
}

exports.yahooFantasy = async function(yearToProcess) {
  const yf = new YahooFantasy(
    process.env.YAHOO_APP_KEY,
    process.env.YAHOO_APP_SECRET
  )
  
  // token for the user
  /**
   * URL To Get Auth Client Token
   * https://yahoo-fantasy-node-docs.vercel.app/
   */
  yf.setUserToken(process.env.YAHOO_ACCESS_TOKEN)
  yf.setRefreshToken(process.env.YAHOO_REFRESH_TOKEN)
  
  // Get the Stat Categories
  // yf.game.stat_categories('388')
  // .then(data => {
  //   console.log(data)
  //   fs.writeFileSync(`./data/yahoo/stat_categories.json`, JSON.stringify(data, null, 2))
  // })
  // .catch(e => handleError(e))


  /**
   * Get start_week and end_week
   */
  let startWeek = 0
  let endWeek = 0

  let collectedWeeklyStats = []

  /**
   * Get a list of the teams and their team numbers
   */
  try {
    let leagueTeams = await yf.league.teams(leagueKeys[yearToProcess])

    startWeek = leagueTeams.start_week
    endWeek = leagueTeams.end_week

    for (let team of leagueTeams.teams) {
      // Add entry for the eventual output
      let teamEntry = {
        team_key: team.team_key,
        team_id: team.team_id,
        name: team.name,
        stats: {}
      }

      
        for (let i = startWeek; i <= endWeek; i++) {

          // Get stats for that week
          try {
            let data = await yf.team.stats(`${team.team_key}`, `${i}`)
          
            // Map the stat ids to include category abbreviations
            const mappedStats = mapStatCategories(data.stats)
            let statArrays = {}

            // Collect the weekly stats into arrays
            for (let stat of mappedStats) {
              if (stat.display_name !== 'H/AB') {
                (teamEntry.stats[stat.display_name] || (teamEntry.stats[stat.display_name] = [])).push(Number.parseFloat(stat.value));
              }
            }
          } catch(err) {
            // handle error
            handleError(err)
          }
        }

      collectedWeeklyStats.push(teamEntry)
    }

    fs.writeFileSync(`./data/yahoo/collectedWeeklyStats.json`, JSON.stringify(collectedWeeklyStats, null, 2))
  }
  catch (err) {
    handleError(err)
  }

  /**
   * For each team...
   * Get players by week
   * Get player stats for that week
   */

  // Weeks 1-24
  // yf.roster.players(`${leagueKeys['2019']}.t.2`, '24')
  // .then(data => {
  //   // player_key, player_id, name.full, selected_position (BN, DL, IL, NA)
  //   const roster = data.roster
  //   fs.writeFileSync(`./data/yahoo/roster.json`, JSON.stringify(roster, null, 2))
  // })
  // .catch(e => handleError(e))
  
  // yf.league.players(`${leagueKeys['2019']}`, ['388.p.8859'], '1')
  // .then(data => {
  //   // player_key, player_id, name.full, selected_position (BN, DL, IL, NA)
    
  //   fs.writeFileSync(`./data/yahoo/roster.json`, JSON.stringify(data, null, 2))
  // })
  // .catch(e => handleError(e))

  // yf.player.stats('388.p.8859')
  // .then(data => {
      
  //   fs.writeFileSync(`./data/yahoo/roster.json`, JSON.stringify(data, null, 2))
  // })
  // .catch(e => handleError(e))
}

function handleError(error) {
  console.error(error)
  return
}

function mapStatCategories(stats) {
  const stat_categories = JSON.parse(fs.readFileSync(`./data/yahoo/stat_categories.json`))
  
  return stats.map(s => {
    const statInfo = stat_categories.stat_categories.find(sc => sc.stat_id == s.stat_id)
    return {
      ...s,
      "display_name": statInfo.display_name
    }
  })
}