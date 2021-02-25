
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

exports.yahooFantasy = async function() {
    const yf = new YahooFantasy(
        process.env.YAHOO_APP_KEY,
        process.env.YAHOO_APP_SECRET
        )
        
    // token for the user
    /**
     * URL To Get Auth Clien Token
     * https://yahoo-fantasy-node-docs.vercel.app/
     */
    yf.setUserToken(process.env.YAHOO_CLIENT_TOKEN)
    
    try {
      // const games = await yf.user.games()
      // console.log(games.games.filter(g => g.code === 'mlb'))
      
      // const meta = await yf.league.meta(leagueKeys['2019'])
      // console.log(meta)

      // const players = await yf.league.players(
      //   leagueKeys['2019'],
      //   [player_key(s)],
      //   week // optional
      // );

      const roster = await yf.team.roster(`${leagueKeys['2019']}.t.2`);
      
      fs.writeFileSync(`./data/yahoo/roster.json`, JSON.stringify(roster, null, 2))

    } catch (e) {
      console.error(e)
      return
    }
}
