var request = require('request');
request.post({
	url:'http://www.moneysedge.com/update_bitcoin_rate',
	form: { bitcoin_exchange_rate : { key : 'bitcoin_rate', value : '$274.28' } }}, function(err,httpResponse,body){
		console.log(body);
	});