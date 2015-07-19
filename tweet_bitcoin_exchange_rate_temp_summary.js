/* required modules */
var fs = require('fs');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'dDkWi5TFgaxxsLFx8vpWgkx6C',
  consumer_secret: 'c8CRPG6LT9vfroQMmQ6gCY9KcttorZM1UGxQpLKFEiwCRVIPbM',
  access_token_key: '323926038-jYesOz3xRbov49fUomDw50VStPX74Qlt0tdW3pnJ',
  access_token_secret: 'SA1eAFcgHStR9EHH5WApXg9eXJAJQ1FEcDVQT9fLJMJ36'
});

var get_bitcoin_exchange_rate_summary = function( arg_file_path ){
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
}
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
var loop_through_files_and_tweet = function(){
	var today = new Date(),
		new_date = new Date();
		new_date.setDate(today.getDate() - 0);
		
	var dd = new_date.getDate(),
		mm = new_date.getMonth() + 1,
		yyyy = new_date.getFullYear();
		
	if(dd < 10){
		dd = '0' + dd;
	}
	if(mm < 10){
		mm = '0' + mm;
	}
	var yesterday = yyyy + '-' + mm + '-' + dd;
	var summary_bistamp = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/bitstamp/bitstamp_exchange_rate_' + yesterday + '.txt');
	var summary_btc_e = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/btc_e/btc_e_exchange_rate_' + yesterday + '.txt');
	var summary_coinbase = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/coinbase/coinbase_exchange_rate_' + yesterday + '.txt');
	var summary_coindesk = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/coindesk/coindesk_exchange_rate_' + yesterday + '.txt');
	var summary_itbit = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/itbit/itbit_exchange_rate_' + yesterday + '.txt');
	var summary_lakebtc = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/lakebtc/lakebtc_exchange_rate_' + yesterday + '.txt');
	var summary_okcoin = get_bitcoin_exchange_rate_summary('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/okcoin/okcoin_exchange_rate_' + yesterday + '.txt');
	
	
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_bistamp.start_rate + ' current_rate:$' + summary_bistamp.close_rate + '(' + summary_bistamp.change_percentage + '%)' + ' #bitstamp @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_btc_e.start_rate + ' current_rate:$' + summary_btc_e.close_rate + '(' + summary_btc_e.change_percentage + '%)' + ' #btc_e @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_coinbase.start_rate + ' current_rate:$' + summary_coinbase.close_rate + '(' + summary_coinbase.change_percentage + '%)' + ' #coinbase @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_coindesk.start_rate + ' current_rate:$' + summary_coindesk.close_rate + '(' + summary_coindesk.change_percentage + '%)' + ' #coindesk @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_itbit.start_rate + ' current_rate:$' + summary_itbit.close_rate + '(' + summary_itbit.change_percentage + '%)' + ' #itbit @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_lakebtc.start_rate + ' current_rate:$' + summary_lakebtc.close_rate + '(' + summary_lakebtc.change_percentage + '%)' + ' #lakebtc @MoneysEdge http://www.moneysedge.com/bitcoin');
	tweet_bitcoin_exchange_rate_summary( 'bitcoin rate-' + yesterday + ' PDT start_rate:$' + summary_okcoin.start_rate + ' current_rate:$' + summary_okcoin.close_rate + '(' + summary_okcoin.change_percentage + '%)' + ' #okcoin @MoneysEdge http://www.moneysedge.com/bitcoin');
	
	// console.log(yesterday + ' start_rate:' + summary_bistamp.start_rate + ' close_rate:' + summary_bistamp.close_rate + ' change:' + summary_bistamp.change_percentage + '%' + ' #bitstamp');
}

/* tweet summary */
loop_through_files_and_tweet()
