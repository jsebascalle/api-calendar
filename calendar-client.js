let rest = require('restler');
const secrets = require("./config/secrets");

class Event{
	constructor(accessToken,calendarID = 'primary'){
		this.destinationURL = "https://www.googleapis.com/calendar/v3/calendars/"+calendarID;
		this.accessToken =accessToken;
		this.calendarID = calendarID;
	}

	create(data,callback){
		var data = JSON.stringify(data);

		var options = Object.assign({},this.defaultInfo(),data);

		rest.post(this.destinationURL+"/events",options).on('complete', callback);
	}

	all(callback){
		rest.get(this.destinationURL+"/events",this.defaultInfo()).on('complete', callback);
	}

	defaultInfo(){
		return {
			headers: {
				"Content-Type": "application/json",
				"Authorization" : "Bearer "+this.accessToken
			}
		}
	}
}

module.exports = Event;