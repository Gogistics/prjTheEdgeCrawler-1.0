/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async');

/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsA.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsB.csv"];
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
GLOBAL.async_parser.csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedRejectResult.csv");
GLOBAL.async_parser.csvWritableStream.on("finish", function(){
	console.log("finish parsing the file...")
});
GLOBAL.async_parser.csvWriteStream = csv.createWriteStream({ headers : true });
GLOBAL.async_parser.count = 0;
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
														console.log(GLOBAL.async_parser.count);
													}else{
														GLOBAL.async_parser.state_index = GLOBAL.async_parser.keys.indexOf("State");
														GLOBAL.async_parser.current_state = data[GLOBAL.async_parser.state_index];
													
														// get annual inc
														GLOBAL.async_parser.amount_requested_index = GLOBAL.async_parser.keys.indexOf("Amount Requested");
														GLOBAL.async_parser.current_amount_requested = data[GLOBAL.async_parser.amount_requested_index];
													
														// get loan amnt
														GLOBAL.async_parser.debt_to_income_ratio_index = GLOBAL.async_parser.keys.indexOf("Debt-To-Income Ratio");
														GLOBAL.async_parser.debt_to_income_ratio = data[GLOBAL.async_parser.debt_to_income_ratio_index];
														
														//
														if( GLOBAL.async_parser.current_state !== undefined &&
															GLOBAL.async_parser.current_state !== "" &&
															GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
															!(GLOBAL.async_parser.current_state in GLOBAL.async_parser.manipulated_obj) &&
															Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1)) >= 0){
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state] = { state : GLOBAL.async_parser.current_state,
																																			numbers_of_loan : 1,
																																			amount_requested : Number(GLOBAL.async_parser.current_amount_requested),
																																			debt_to_income_ratio : Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1))};
														}else if(GLOBAL.async_parser.current_state !== undefined &&
																GLOBAL.async_parser.current_state !== "" &&
																GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
																Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1)) >= 0){
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].numbers_of_loan += 1;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].amount_requested += Number(GLOBAL.async_parser.current_amount_requested);
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].debt_to_income_ratio += Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1));
														}
														
														//
														if(GLOBAL.async_parser.current_state === 'CA'){
															console.log(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state]);
														}
													}
													
													//
													GLOBAL.async_parser.count += 1;
												})
												.on("end", function(){
										   			// close readable stream
										            console.log("end readable stream");
											   		for (var key in GLOBAL.async_parser.manipulated_obj) {
											   		   	if (GLOBAL.async_parser.manipulated_obj.hasOwnProperty(key)) {
											   		     	GLOBAL.async_parser.csvWriteStream.write(GLOBAL.async_parser.manipulated_obj[key]);
											   		   	}
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
