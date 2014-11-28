# Description:
#   Layin' down some sick jokes.
#
# Dependencies
#   Lodash
#
# Commands:
#   hubot be more funny - Fetches a monthly top list of jokes from reddit and returns a 
#   random one from the result set.
#
_ = require 'lodash'

module.exports = (robot) ->
  robot.respond /(be more funny)/i, (msg) ->
    robot.http("http://www.reddit.com/r/jokes/top.json?limit=100&t=month")
    .get() (err, res, body) ->
      msg.send _.sample(_.map(JSON.parse(body).data.children, (joke) -> "#{joke.data.title} #{joke.data.selftext}"))

