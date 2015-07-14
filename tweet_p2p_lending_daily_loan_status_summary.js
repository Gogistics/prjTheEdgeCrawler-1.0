/* required modules */
var fs = require('fs');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'dDkWi5TFgaxxsLFx8vpWgkx6C',
  consumer_secret: 'c8CRPG6LT9vfroQMmQ6gCY9KcttorZM1UGxQpLKFEiwCRVIPbM',
  access_token_key: '323926038-jYesOz3xRbov49fUomDw50VStPX74Qlt0tdW3pnJ',
  access_token_secret: 'SA1eAFcgHStR9EHH5WApXg9eXJAJQ1FEcDVQT9fLJMJ36'
});

var get_lendingclub_summary = function( arg_file_path ){
	var summary = { min_rate : undefined, max_rate : undefined, start_rate : 0, close_rate : 0, change_percentage : 0}
	var data = fs.readFileSync( arg_file_path, 'utf-8' );
	var lines = data.split('\n');
	lines.forEach(function(line, index){
		var new_line = line.replace(/"/g, '\"')
		try{
			var obj = JSON.parse(new_line);
			
			if(summary.min_rate === undefined || summary.min_rate > obj.rate){
				summary.min_rate = obj.rate;
			}
			if(summary.max_rate === undefined || summary.max_rate < obj.rate){
				summary.max_rate = obj.rate;
			}
			if(index === 0){
				summary.start_rate = obj.rate;
			}
			summary.close_rate = obj.rate;
		}catch(err){
			console.log(err);
		}
	});
	
	summary.change_percentage = ( (summary.close_rate - summary.start_rate) / summary.start_rate * 100 ).toFixed(2);
	return summary;
};

var tweet_bitcoin_exchange_rate_summary = function( arg_status ){
	var tweet_detail = { status : arg_status,
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

/*
var get_newest_file = function(dir, files, callback) {
	var dir = './'; // your directory

	var files = fs.readdirSync(dir);
	files.sort(function(a, b) {
	               return fs.statSync(dir + a).mtime.getTime() - 
	                      fs.statSync(dir + b).mtime.getTime();
	           });
	return files[0];
};
*/

var get_newest_file = function( arg_dir ){
	var files = fs.readdirSync(arg_dir)
	              .map(function(v) { 
	                  return { name:v,
	                           time:fs.statSync(arg_dir + v).mtime.getTime()
	                         }; 
	               })
	               .sort(function(a, b) { return a.time - b.time; })
	               .map(function(v) { return v.name; });
	return files[0];
};

var loop_through_files_and_tweet = function(){
	var dir_lendingclub = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/media/';
	var newest_file = get_newest_file();
	console.log(newest_file);
	get_lendingclub_summary(dir_lendingclub + newest_file);
	// tweet_bitcoin_exchange_rate_summary( 'daily loan status-' + yesterday + ' PDT Total Loans:$' + summary_bistamp.start_rate + ' Avg. Amt:$' + summary_bistamp.close_rate + ' @LendingClub #p2p_lending http://www.moneysedge.com/data_analysis?data_provider=lending_club&data_category=daily_loan_status');

	// console.log(yesterday + ' start_rate:' + summary_bistamp.start_rate + ' close_rate:' + summary_bistamp.close_rate + ' change:' + summary_bistamp.change_percentage + '%' + ' #bitstamp');
}

/* tweet summary */
loop_through_files_and_tweet()
