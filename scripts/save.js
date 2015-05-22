// Description:
//  This will help us save and do the saving throug marvin
//
// Dependencies:
//  request
//
// Configuration:
//  None
// Commands:
//  hubot save - Gets help with saving
var request = require('request');
var slackToken = "cLSehYweAMPA1ZhgWMww9Xap";

var deniedMinutesResponses = [
	'You cant trick me, pleae correct your time',
	'You think im stupid? Adjust your input',
	'Look at your time, its just wrong'
];

var errorResponses = [
	'Ooopsi doopsie, I think i shit my leg',
	'I dont think that packet came all the way to the end, sawwy',
	'I failed master, let me make it up to you',
	'Something went wrong and its all my fault',
	'Pooop, i failed delivering that message'
]

var successResponses = [
	'Yeaaahhjj, that task was saved!',
	'Go figure, it worked! Ask Ken to se the result',
	'Im not worthless afterall, it got saved, hurray!',
	'Holy stinkballs, i made it! Its saved in the big internet',
	'Whos the boss, i got it save for you master!'
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

  robot.respond(/check\s?(.+)?\s?(.+)?$/i, function (msg) {
  	msg.send(msg.message.user.name);
  	if(msg.match[1]) {
  		if(msg.match[2]) {
  			msg.send("checking "+msg.match[2]);
  			for(var key in msg[msg.match[1]][msg.match[2]]) {
		  		msg.send(key);
		  	}	
		  	return
  		}
  		msg.send("Checking "+msg.match[1]);
		for(var key in msg[msg.match[1]]) {
	  		msg.send(key);
	  	}  			
	  	return;
  	}
  	for(var key in msg) {
  		msg.send(key);
  	}
  });

  robot.respond(/save (\d+) lines?$/i, function (msg) {
  	saveRequest(msg, "$save -l", "lines");
  });

  robot.respond(/save (\d+) minutes?$/i, function (msg) {
  	saveRequest(msg, "$save -m", "minutes");
  });

  robot.respond(/save (([0-1]?[0-9]|[2][0-3]):([0-5][0-9])) (([0-1]?[0-9]|[2][0-3]):([0-5][0-9]))/i, function (msg) {
  	if(parseInt(msg.match[1].split(":")[0]) > parseInt(msg.match[4].split(":")[0])) {
  		msg.send( msg.random(deniedMinutesResponses));
  		return;
  	} else if(parseInt(msg.match[1].split(":")[1]) > parseInt(msg.match[4].split(":")[1])) {
  		msg.send( msg.random(deniedMinutesResponses));
  		return;
  	}

  	saveRequest(msg, "$save -t");
  })

};

var getValues = function (msg, isTime) {
	return isTime ? msg.match[1] +" "+ msg.match[4] : msg.match[1] ;
}

var isItTimeCommand = function(command) {
	return command.indexOf("-t") > -1
}

var saveRequest = function (msg, command, text) {
	var isTime = isItTimeCommand(command);
	if(isTime) {
		msg.send("Saving timesegment: "+msg.match[1]+" - "+msg.match[4]+", "+msg.random(waitMessages));
	} else {
		msg.send("Saving "+msg.match[1]+" "+text+ ", "+msg.random(waitMessages));	
	}
	
	var token = slackToken;
  	var text = command +" "+ getValues(msg, isTime);
  	var channel_name = msg.message.room; 
  	var user_id = msg.message.user.id;
  	var user_name = msg.message.user.name;
  	var body = {token:token, text:text, channel_name:channel_name, user_id:user_id, user_name:user_name};

	request({
			headers: {
			  'Content-Type': 'application/json'
			},
			uri: "http://nplol-hook.herokuapp.com/hook/slack",
			json: true,
			body: body,
			method: 'POST'
		}, 
		function (err, res, body) {
			if(err) {
				msg.send(msg.random(errorResponses) +" "+err);
			}
			else {
				msg.send(msg.random(successResponses));
			}
	});
}