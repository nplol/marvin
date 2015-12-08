// Description:
// For when conversations just won't start.
//
// Dependencies:
//  None
//
// Configuration:
//  None
// Commands:
//  marvin tumbleweeds - Receive appropriate gif

module.exports = function (robot) {

  robot.respond(/(tumbleweeds)/i, function (msg) {
    msg.send("http://i.imgur.com/LklRY3h.gif");
  });

};
