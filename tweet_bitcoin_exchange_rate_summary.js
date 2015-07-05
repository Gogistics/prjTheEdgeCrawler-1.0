/* required modules */
var fs = require('fs');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'dDkWi5TFgaxxsLFx8vpWgkx6C',
  consumer_secret: 'c8CRPG6LT9vfroQMmQ6gCY9KcttorZM1UGxQpLKFEiwCRVIPbM',
  access_token_key: '323926038-jYesOz3xRbov49fUomDw50VStPX74Qlt0tdW3pnJ',
  access_token_secret: 'SA1eAFcgHStR9EHH5WApXg9eXJAJQ1FEcDVQT9fLJMJ36'
});
var summary = { min_rate : 0, max_rate : 0, start_rate : 0, close_rate : 0, change_percentage : 0}
var get_bitcoin_exchange_rate_summary = function( arg_file_path ){
	var data = fs.readFileSync( arg_file_path, 'utf-8' );
	var lines = data.split('\n');
	lines.forEach(function(line, index){
		var new_line = line.replace(/"/g, '\"')
		try{
			var obj = JSON.parse(new_line);
			console.log('rate: ' + obj.rate)
		}catch(err){
			console.log(err);
		}
	});
	var summary;
	return summary;
}
var tweet_bitcoin_exchange_rate_summary = function(){
	var tweet_detail = { status : '',
						lat : 37.605369,
						long : -122.414169,
						display_coordinates : true,
	 					trim_user : true };
						
	client.post('statuses/update', tweet_detail,  function(error, tweet, response){
	  	if(error) throw error;
	  	console.log(tweet);  // Tweet body. 
	  	console.log(response);  // Raw response object. 
	});
}

/* tweet summary */
// tweet_bitcoin_exchange_rate_summary()
get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/bitstamp/bitstamp_exchange_rate_2015-07-04.txt')