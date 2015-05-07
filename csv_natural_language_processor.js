/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async'),
	natural = require('natural');

/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsA.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsB.csv"];

/* node.js NLP for multiple files with async */
GLOBAL.tokenizer = new natural.WordTokenizer();
GLOBAL.async_nlp = GLOBAL.async_nlp || {};
GLOBAL.async_nlp.csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_of_loan_title.csv");
GLOBAL.async_nlp.csvWritableStream.on("finish", function(){
	console.log("finish parsing the file...")
});
GLOBAL.async_nlp.csvWriteStream = csv.createWriteStream({ headers : true });
GLOBAL.async_nlp.count = 0, GLOBAL.async_nlp.ith_file = 0;
GLOBAL.async_nlp.keys = [];
GLOBAL.keywords = GLOBAL.keywords || [];
GLOBAL.async_nlp.manipulated_obj = {};
GLOBAL.async_nlp.csvWriteStream.pipe(GLOBAL.async_nlp.csvWritableStream);
GLOBAL.async_nlp.parse_files = function (arg_files){
										async.forEach(arg_files, function(file_path, callback){
											var csvReadStream = fs.createReadStream(file_path);
											// start to parse data
											var csvReadableStream = csv()
												.on("data", function(data){
													if(GLOBAL.async_nlp.count === 0 || (JSON.stringify(data) === JSON.stringify(GLOBAL.async_nlp.keys))){
														GLOBAL.async_nlp.keys = data;
													}else{
														GLOBAL.async_nlp.state_index = GLOBAL.async_nlp.keys.indexOf("State");
														GLOBAL.async_nlp.current_state = data[GLOBAL.async_nlp.state_index];
														
														// debt  to income ratio
														GLOBAL.async_nlp.debt_to_income_ratio_index = GLOBAL.async_nlp.keys.indexOf("Debt-To-Income Ratio");
														GLOBAL.async_nlp.debt_to_income_ratio = data[GLOBAL.async_nlp.debt_to_income_ratio_index];
														var temp_debt_to_inc_ratio = Number(GLOBAL.async_nlp.debt_to_income_ratio.slice(0, -1));
														
														// get loan title
														GLOBAL.async_nlp.loan_title_index = GLOBAL.async_nlp.keys.indexOf("Loan Title");
														GLOBAL.async_nlp.loan_title = data[GLOBAL.async_nlp.loan_title_index];
														
														// build structure
														if( GLOBAL.async_nlp.current_state !== undefined &&
															GLOBAL.async_nlp.current_state !== "" &&
															GLOBAL.async_nlp.current_state === GLOBAL.async_nlp.current_state.toUpperCase() &&
															!(GLOBAL.async_nlp.current_state in GLOBAL.async_nlp.manipulated_obj) &&
															temp_debt_to_inc_ratio >= 0){
																
																// do something...
																GLOBAL.async_nlp.manipulated_obj[GLOBAL.async_nlp.current_state] = { state : GLOBAL.async_nlp.current_state,
																																	numbers_of_loan : 1,
																																	debt_to_income_ratio : Math.round(Number(GLOBAL.async_nlp.debt_to_income_ratio.slice(0, -1))),
																																	};
																// console.log(GLOBAL.async_nlp.keys);
																
														}else if(GLOBAL.async_nlp.current_state !== undefined &&
																GLOBAL.async_nlp.current_state !== "" &&
																GLOBAL.async_nlp.current_state === GLOBAL.async_nlp.current_state.toUpperCase() &&
																temp_debt_to_inc_ratio >= 0){
																
																// do something...
																var temp_result = GLOBAL.tokenizer.tokenize(GLOBAL.async_nlp.loan_title.toLowerCase());
																console.log(temp_result);
																temp_result = GLOBAL.keywords.concat(temp_result);
																console.log(temp_result);
																temp_result = GLOBAL.tokenizer.tokenize(GLOBAL.keywords.toString().toLowerCase());
																
														}
													}
													
													// count iteration
													GLOBAL.async_nlp.count += 1;
												})
												.on("end", function(){
										   			// close readable stream
													GLOBAL.async_nlp.ith_file += 1;
													if(GLOBAL.async_nlp.ith_file === csv_files.length){
											   		     GLOBAL.async_nlp.csvWriteStream.write(GLOBAL.keywords);
											   		}
										            console.log("end readable stream ; current count:" + GLOBAL.async_nlp.count);
													console.log(JSON.stringify(GLOBAL.async_nlp.manipulated_obj));
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										});
									}

// start to process
GLOBAL.async_nlp.parse_files(csv_files);
