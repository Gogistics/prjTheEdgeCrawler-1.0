/* required modules */
var fs = require('fs'),
	csv = require('fast-csv'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural'),
	sync_request = require('sync-request'),
	cheerio = require("cheerio");
	
/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3b.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3c.csv"];
				
/* init */
GLOBAL.async_parser = GLOBAL.async_parser || {};
GLOBAL.async_parser.count = 0, GLOBAL.async_parser.ith_file = 0;
GLOBAL.async_parser.keys = [];
GLOBAL.async_parser.manipulated_obj = {};

GLOBAL.async_parser.request_loan_detail = function(arg_url, callback){
	var res = sync_request('GET', arg_url);
	return res.getBody();
}

GLOBAL.async_parser.parse_files = function (arg_files){
										async.forEach(arg_files, function(file_path, callback){
											var csvReadStream = fs.createReadStream(file_path);
											// start to parse data
											var csvReadableStream = csv()
												.on("data", function(data){
													if(GLOBAL.async_parser.count === 0 || (JSON.stringify(data) === JSON.stringify(GLOBAL.async_parser.keys))){
														GLOBAL.async_parser.keys = data;
													}else{
														GLOBAL.async_parser.id_index = GLOBAL.async_parser.keys.indexOf("url");
														GLOBAL.async_parser.id = data[GLOBAL.async_parser.id_index];
														
														// get date (not done; get date from web-page)
														GLOBAL.async_parser.url_index = GLOBAL.async_parser.keys.indexOf("url");
														GLOBAL.async_parser.url = data[GLOBAL.async_parser.url_index];
														var body = GLOBAL.async_parser.request_loan_detail(GLOBAL.async_parser.url);
														var $ = cheerio.load(body);
														var content = $('div.master_content-outer-container').html();
														
														var write_file_path = "./lendingclub/loan_stats_" + GLOBAL.async_parser.id + ".json";
														jsonfile.writeFile(write_file_path, content, function(err){
															if(err){
																console.log(err);
															}
														});
													}
														
													// count iteration
													GLOBAL.async_parser.count += 1;
												})
												.on("end", function(){
													console.log('done...');
														
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										});
									};
/* end of parser */