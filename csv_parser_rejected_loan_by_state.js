/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async');

/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsA.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsB.csv"];

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
GLOBAL.async_parser.count = 0, GLOBAL.async_parser.ith_file = 0;
GLOBAL.async_parser.keys = [];
GLOBAL.async_parser.manipulated_obj = {};
GLOBAL.async_parser.csvWriteStream.pipe(GLOBAL.async_parser.csvWritableStream);
GLOBAL.async_parser.parse_files = function (arg_files){
										async.forEach(arg_files, function(file_path, callback){
											var csvReadStream = fs.createReadStream(file_path);
											// start to parse data
											var csvReadableStream = csv()
												.on("data", function(data){
													if(GLOBAL.async_parser.count === 0 || (JSON.stringify(data) === JSON.stringify(GLOBAL.async_parser.keys))){
														GLOBAL.async_parser.keys = data;
													}else{
														GLOBAL.async_parser.state_index = GLOBAL.async_parser.keys.indexOf("State");
														GLOBAL.async_parser.current_state = data[GLOBAL.async_parser.state_index];
													
														// get annual inc
														GLOBAL.async_parser.amount_requested_index = GLOBAL.async_parser.keys.indexOf("Amount Requested");
														GLOBAL.async_parser.current_amount_requested = data[GLOBAL.async_parser.amount_requested_index];
													
														// get loan amnt
														GLOBAL.async_parser.debt_to_income_ratio_index = GLOBAL.async_parser.keys.indexOf("Debt-To-Income Ratio");
														GLOBAL.async_parser.debt_to_income_ratio = data[GLOBAL.async_parser.debt_to_income_ratio_index];
														
														// get date
														GLOBAL.async_parser.date_index = GLOBAL.async_parser.keys.indexOf("Application Date");
														GLOBAL.async_parser.date = data[GLOBAL.async_parser.date_index];
														
														// get risk score
														GLOBAL.async_parser.risk_score_index = GLOBAL.async_parser.keys.indexOf("Risk_Score");
														GLOBAL.async_parser.risk_score = data[GLOBAL.async_parser.risk_score_index];
														
														// get employment length
														GLOBAL.async_parser.employment_length_index = GLOBAL.async_parser.keys.indexOf("Employment Length");
														GLOBAL.async_parser.employment_length = data[GLOBAL.async_parser.employment_length_index];
														var regex_smaller_sign = /\</g,
														regex_plus_sign = /\+/g,
														regex_employment_length = /\d+/g,
														employment_length = 0,
														temp_employment_length = GLOBAL.async_parser.employment_length.match(regex_employment_length);
														
														if(GLOBAL.async_parser.employment_length.match(regex_smaller_sign)){
															employment_length = 0.5;
														}else if(GLOBAL.async_parser.employment_length.match(regex_plus_sign)){
															employment_length = 10.5;
														}else if(temp_employment_length === undefined || temp_employment_length === null){
															employment_length = 0;
														}else{
															employment_length = Number(temp_employment_length[0]);
														}
														
														// temp FICO & Vantage Value
														var temp_fico = 0, temp_vantage = 0, count_fico = 0, count_vantage = 0;
														if( new Date(GLOBAL.async_parser.date).valueOf() < new Date("2013-11-5").valueOf() ){
															temp_fico = Number(GLOBAL.async_parser.risk_score);
															count_fico = 1;
														}else{
															temp_vantage = Number(GLOBAL.async_parser.risk_score);
															count_vantage = 1;
														}
														
														// debt  to income ratio
														var temp_debt_to_inc_ratio = Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1));
														
														// build new structure
														if( GLOBAL.async_parser.current_state !== undefined &&
															GLOBAL.async_parser.current_state !== "" &&
															GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
															!(GLOBAL.async_parser.current_state in GLOBAL.async_parser.manipulated_obj) &&
															temp_debt_to_inc_ratio >= 0){
																//
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state] = { state : GLOBAL.async_parser.current_state,
																																			numbers_of_loan : 1,
																																			amount_requested : Math.round(Number(GLOBAL.async_parser.current_amount_requested)),
																																			debt_to_income_ratio : Math.round(Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1))),
																																			count_fico : count_fico,
																																			total_fico : temp_fico,
																																			count_vantage : count_vantage,
																																			total_vantage : temp_vantage,
																																			employment_length : employment_length,
																																			from_date : GLOBAL.async_parser.date,
																																			to_date : GLOBAL.async_parser.date,
																																		};
														}else if(GLOBAL.async_parser.current_state !== undefined &&
																GLOBAL.async_parser.current_state !== "" &&
																GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
																temp_debt_to_inc_ratio >= 0){
																	//
																	if( new Date(GLOBAL.async_parser.date).valueOf() < new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].from_date).valueOf() ){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].from_date = GLOBAL.async_parser.date;
																	}
																	if( new Date(GLOBAL.async_parser.date).valueOf() > new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].to_date).valueOf() ){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].to_date = GLOBAL.async_parser.date;
																	}
																	
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].numbers_of_loan += 1;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].amount_requested += Math.round(Number(GLOBAL.async_parser.current_amount_requested));
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].debt_to_income_ratio += Math.round(Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1)));
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].count_fico += count_fico;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].total_fico += temp_fico;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].count_vantage += count_vantage;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].total_vantage += temp_vantage;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_state].employment_length += employment_length;
														}
													}
													
													// count iteration
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
											console.log("done with parsing files");
											if(err){
												console.log(err);
											}else{
												GLOBAL.async_parser.csvWriteStream.end();
												console.log(JSON.stringify(GLOBAL.async_parser.manipulated_obj));
											}
										});
									}

// start to parse
GLOBAL.async_parser.parse_files(csv_files);
/* end of parser */
