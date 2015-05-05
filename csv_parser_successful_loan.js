/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async');

/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3b.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3c.csv"];
// prototype one
function parser_one(){
	async.filter(csv_files, fs.exists, function(results){
	    console.log('-*-');
		console.log(results);
		console.log('-*-');
	});
};
/* end of new parser */

/* prototype two */
function parser_two(){
	async.forEach(csv_files, function (item, callback){ 
	    console.log(item); // print the key
	    callback(); // tell async that the iterator has completed

	}, function(err) {
	    console.log('iterating done');
	});
}
/* end */

/* node.js parser for multiple files with async */
GLOBAL.async_parser = GLOBAL.async_parser || {};
GLOBAL.async_parser.csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedResult.csv");
GLOBAL.async_parser.csvWritableStream.on("finish", function(){
	console.log("finish parsing the file...")
});
GLOBAL.async_parser.csvWriteStream = csv.createWriteStream({ headers : true });
GLOBAL.async_parser.count = 0, GLOBAL.async_parser.ith_file = 0;
GLOBAL.async_parser.keys = [];
GLOBAL.async_parser.manipulated_obj = {};
GLOBAL.async_parser.csvWriteStream.pipe(GLOBAL.async_parser.csvWritableStream);
GLOBAL.async_parser.parse_files = function (arg_files){
										async.forEach(arg_files, function(file_path, callback){
											var csvReadStream = fs.createReadStream(file_path);
											var csvReadableStream = csv()
												.on("data", function(data){
													if(GLOBAL.async_parser.count === 0 || (JSON.stringify(data) === JSON.stringify(GLOBAL.async_parser.keys))){
														GLOBAL.async_parser.keys = data;
														console.log(GLOBAL.async_parser.keys);
													}else{
														GLOBAL.async_parser.addr_state_index = GLOBAL.async_parser.keys.indexOf("addr_state");
														GLOBAL.async_parser.current_addr_state = data[GLOBAL.async_parser.addr_state_index];
													
														// get annual inc
														GLOBAL.async_parser.annual_inc_index = GLOBAL.async_parser.keys.indexOf("annual_inc");
														GLOBAL.async_parser.current_annual_inc = data[GLOBAL.async_parser.annual_inc_index];
													
														// get loan amnt
														GLOBAL.async_parser.loan_amnt_index = GLOBAL.async_parser.keys.indexOf("loan_amnt");
														GLOBAL.async_parser.current_loan_amnt = data[GLOBAL.async_parser.loan_amnt_index];
													
														//
														if( GLOBAL.async_parser.current_addr_state !== undefined &&
															GLOBAL.async_parser.current_addr_state !== "" &&
															!(GLOBAL.async_parser.current_addr_state in GLOBAL.async_parser.manipulated_obj)){
															GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_addr_state] = { addr_state : GLOBAL.async_parser.current_addr_state,
																																			numbers_of_loan : 1,
																																			total_annual_inc : Number(GLOBAL.async_parser.current_annual_inc),
																																			total_loan_amnt : Number(GLOBAL.async_parser.current_loan_amnt)};
														}else if(GLOBAL.async_parser.current_addr_state !== undefined &&
															GLOBAL.async_parser.current_addr_state !== ""){
															//
															GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_addr_state].numbers_of_loan += 1;
															GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_addr_state].total_annual_inc += Number(GLOBAL.async_parser.current_annual_inc);
															GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_addr_state].total_loan_amnt += Number(GLOBAL.async_parser.current_loan_amnt);
														}
													}
													
													//
													GLOBAL.async_parser.count += 1;
												})
												.on("end", function(){
										   			// close readable stream
													GLOBAL.async_parser.ith_file += 1;
													if(GLOBAL.async_parser.ith_file === csv_files.length){
												   		for (var key in GLOBAL.async_parser.manipulated_obj) {
												   		   	if (GLOBAL.async_parser.manipulated_obj.hasOwnProperty(key)) {
												   		     	GLOBAL.async_parser.csvWriteStream.write(GLOBAL.async_parser.manipulated_obj[key]);
												   		   	}
												   		}
											            console.log("end readable stream ; current count:" + GLOBAL.async_parser.count);
														console.log(JSON.stringify(GLOBAL.async_parser.manipulated_obj));
													}
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										}, function(err){
											if(err){
												console.log(err);
											}else{
												GLOBAL.async_parser.csvWriteStream.end();
												console.log("done with parsing files");
											}
										});
									}

// start to parse
GLOBAL.async_parser.parse_files(csv_files);
/* end of parser */
