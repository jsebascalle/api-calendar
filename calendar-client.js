let rest = require('restler');
const secrets = require("./config/secrets");

class Event{
	constructor(accessToken,calendarID = 'primary'){
		this.destinationURL = "https://www.googleapis.com/calendar/v3/calendars/"+calendarID+'/events';
		this.accessToken =accessToken;
		this.calendarID = calendarID;
	}

	all(callback){
		rest.get(this.destinationURL,this.defaultInfo()).on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
		    return result;
		  }
		});
	}

	defaultInfo(){
		return {
			headers: {
				"Content-Type": "application/json",
				"Authorization" : "Bearer "+this.accessToken
			},
			timeout: 10000
		}
	}
}

module.exports = Event;