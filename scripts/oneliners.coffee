# Description:
#   Cracking sick oneliners.
#
# Dependencies:
#   Cheerio 0.18.x
#
# Commands:
#   hubot crack me up - Scrapes reddit.com/r/oneliners monthly top list and returns a random oneliner.
#
cheerio = require 'cheerio'
_       = require 'lodash'

module.exports = (robot) ->
  robot.respond /(crack me up)/i, (msg) ->
    robot.http("http://www.reddit.com/r/oneliners/top/?sort=top&t=month")
      .get() (err, res, body) ->
        $ = cheerio.load(body)
        oneliners = _.map($('a.title'), (link) -> link.children[0].data)
        msg.send _.sample(oneliners)
