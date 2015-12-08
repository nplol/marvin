# Description:
#   Cracking sick oneliners.
# 
# Dependencies
#   Lodash
#
# Commands:
#   hubot crack me up - Fetches the all-time best oneliners from reddit and returns a 
#   random one from the result set.
#
_       = require 'lodash'

module.exports = (robot) ->
  robot.respond /(crack me up)/i, (msg) ->
    robot.http("http://www.reddit.com/r/oneliners/top.json?limit=100&&t=all")
      .get() (err, res, body) ->
        msg.send _.sample(_.map(JSON.parse(body).data.children, (redditPost) -> redditPost.data.title))
