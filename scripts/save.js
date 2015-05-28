// Description:
//  This will help us save and do the saving through marvin
//
// Dependencies:
//  request, lodash
//
// Configuration:
//  None
// Commands:
//  marvin save - Try it out and see what marvin says

var request = require('request');
var _ = require('lodash')
var slackToken = process.env.SLACK_HOOKER_TOKEN;
var allowedTimeSeperatorChars = [".", ":", "-"];

var deniedMinutesResponses = [
	'You cant trick me, please correct your time',
	'You think im stupid? Adjust your input',
	'Look at your time, it´s just wrong'
];

var errorResponses = [
	'Ooopsi doopsie, I think i shit my leg',
	'I dont think that packet came all the way to the end, sawwy',
	'I failed master, let me make it up to you',
	'Something went wrong and its all my fault',
	'Pooop, I failed delivering that message'
]

var successResponses = [
	'Yeaaahhjj, that task was saved!',
	'Go figure, it worked! Ask Ken to se the result',
	'Im not worthless afterall, it got saved, hurray!',
	'Holy stinkballs, I made it! It´s saved in the big internet',
	'Who´s the boss, I got it saved for you master!'
]

var waitMessages = [
	'just hang thight',
	'take a coke and wait',
	'make out with some girls while im finishing',
	'grab a chair and look at the sky until im done'
]

module.exports = function (robot) {

  robot.respond(/(save$)/i, function (msg) {
    msg.send(
    	"What would you like to save? \n"+
    	"The last x lines: marvin save 5 lines \n"+
    	"The last x minutes: marvin save 10 minutes \n"+
    	"From x to y: marvin save 10:20 10:30"
    );
  });

  robot.respond(/save (\d+) lines?$/i, function (msg) {
  	saveRequest(msg, "LINE");
  });

  robot.respond(/save (\d+) minutes?$/i, function (msg) {
  	saveRequest(msg, "MINUTES");
  });

  /*
	RegEx that listens for "save nr:nr nr:nr"
	save is obligatory, both spaces are obligatory, aswell as the : sign.
	Its catches 6 RegEx groups
	The groups can be accesed through the msg.match array. This is Hubot api.
	array[0] is full match, and then follows each RegEx group.
	Group 1: matches the first timeset
	Group 2: matches number 00-23. Optional 0-1, with 0-9, eller 2 with 0-3.
	Group 3: matches number 0-5 with 0-9
	Group 4: matches the second timeset
	Group 5: same as group 2
	Group 6: same as group 3
  */
  robot.respond(/save (([0-1]?[0-9]|[2][0-3]):([0-5][0-9])) (([0-1]?[0-9]|[2][0-3]):([0-5][0-9]))/i, function (msg) {
  	if(isHoursAfterEachother(msg)) {
  		msg.send( msg.random(deniedMinutesResponses));
  		return;
  	} else if(isMinutesAfterEachother(msg)) {
  		msg.send( msg.random(deniedMinutesResponses));
  		return;
  	}

  	saveRequest(msg, "TIME");
  })
};

var isHoursAfterEachother = function(msg) {
	return (parseInt(msg.match[1].split(":")[0]) > parseInt(msg.match[4].split(":")[0]))
}

var isMinutesAfterEachother = function(msg) {
	return (parseInt(msg.match[1].split(":")[1]) > parseInt(msg.match[4].split(":")[1]))
}

var parseTime = function(time) {
	var now = new Date(Date.now());
	_.forEach(allowedTimeSeperatorChars, function(char) {
		if(_.contains(time, char)) {
			time = time.split(char);
		}
	});
	now.setHours(time[0]);
	now.setMinutes(time[1]);
	return Date.parse(now +" GMT+0100");
}

var saveRequest = function (msg, type) {
	var isTime = type === "TIME";
	if(isTime) {
		msg.send("Saving timesegment: "+msg.match[1]+" to "+msg.match[4]+", "+msg.random(waitMessages));
	} else {
		msg.send("Saving "+msg.match[1]+" "+(type == "LINE" ? "lines" : "minutes")+ ", "+msg.random(waitMessages));	
	}

  	var body = {
  		token: slackToken,  
  		channel_name: msg.message.room, 
  		user_id: msg.message.user.id, 
  		user_name: msg.message.user.name,
  		type: type,
  		start: isTime ? parseTime(msg.match[1]) : Date.now(),
		end: isTime ? parseTime(msg.match[4]) : msg.match[1]  		
  	};

	request({
			headers: {
			  'Content-Type': 'application/json',
			},
			uri: "http://nplol-hook.herokuapp.com/hook/slack/save",
			json: true,
			body: body,
			method: 'POST'
		}, 
		function (err, res, body) {
			if(err) {
				msg.send(msg.random(errorResponses) +" "+err);
			}
			else if(res.statusCode != 200){
				msg.send(res.statusCode +" - "+ msg.random(errorResponses));
				msg.send(res.body);
			}
			else {
				msg.send(msg.random(successResponses));
			}
	});
}
