// Description:
//  Badom Tss
//
// Dependencies:
//  None
//
// Configuration:
//  None
// Commands:
//  marvin rimshot - Receive appropriate gif

module.exports = function (robot) {

  robot.respond(/(rimshot)/i, function (msg) {
    msg.send("https://i.makeagif.com/media/3-25-2015/MYsLCq.gif");
  });

};
