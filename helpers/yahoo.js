
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
  
  /**
   * Get start_week and end_week
   */
  let startWeek = 0
  let endWeek = 0

  /**
   * Get a list of the teams and their team numbers
   */
  // yf.league.teams(leagueKeys[yearToProcess])
  // .then(data => {
  //   startWeek = data.start_week
  //   endWeek = data.end_week
  //   console.log(`${startWeek} - ${endWeek}`)

  //   // console.log(data)
  //   for (let team of data.teams) {
  //     // team_key, team_id, name
  //     console.log({
  //       team_key: team.team_key,
  //       team_id: team.team_id,
  //       name: team.name
  //     })
  //   }
  // })
  // .catch(e => handleError(e))

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
  
  yf.league.players(`${leagueKeys['2019']}`, ['388.p.8859'], '1')
  .then(data => {
    // player_key, player_id, name.full, selected_position (BN, DL, IL, NA)
    
    fs.writeFileSync(`./data/yahoo/roster.json`, JSON.stringify(data, null, 2))
  })
  .catch(e => handleError(e))


}

function handleError(error) {
  console.error(error)
  return
}
