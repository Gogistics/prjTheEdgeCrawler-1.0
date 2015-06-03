/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async'),
	jsonfile = require("jsonfile"),
	natural = require('natural');

/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsA.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsB.csv"];

/* node.js parser for multiple files with async */
GLOBAL.async_parser = GLOBAL.async_parser || {};
GLOBAL.async_parser.csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedRejectResultByNYZipcode.json");
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
														
														GLOBAL.async_parser.zipcode_index = GLOBAL.async_parser.keys.indexOf("Zip Code");
														GLOBAL.async_parser.current_zipcode = data[GLOBAL.async_parser.zipcode_index];
													
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
														
														// get loan title
														GLOBAL.async_parser.loan_title_index = GLOBAL.async_parser.keys.indexOf("Loan Title");
														GLOBAL.async_parser.loan_title = data[GLOBAL.async_parser.loan_title_index].toLowerCase();
														GLOBAL.async_parser.loan_title = GLOBAL.async_parser.loan_title.replace(/^\w\s/gi, ' '); // remove all special characters
														// classify loan type
														var loan_type = GLOBAL.classifier.classify(GLOBAL.async_parser.loan_title);
														if(loan_type === undefined || loan_type === null){
															loan_type = "other";
														}
														
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
															GLOBAL.async_parser.current_state === "NY" &&
															GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
															temp_debt_to_inc_ratio >= 0 &&
															!(GLOBAL.async_parser.current_zipcode in GLOBAL.async_parser.manipulated_obj) ){
																
																// get current date
																var current_date = GLOBAL.async_parser.date;
																
																//
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode] = {
																																numbers_of_loan : 1,
																																amount_requested : Math.round(Number(GLOBAL.async_parser.current_amount_requested)),
																																debt_to_income_ratio : Math.round(Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1))),
																																count_fico : count_fico,
																																total_fico : temp_fico,
																																count_vantage : count_vantage,
																																total_vantage : temp_vantage,
																																employment_length : employment_length,
																																from_date : current_date,
																																to_date : current_date,
																															};
																															
																// build dates arrary
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['dates'] = {};
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['dates'][current_date] = 1;
																console.log('Zipcode: ' + GLOBAL.async_parser.current_zipcode );
																
																//
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'] = {};
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] = 1;
																
														}else if(GLOBAL.async_parser.current_state !== undefined &&
																GLOBAL.async_parser.current_state === "NY" &&
																GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
																temp_debt_to_inc_ratio >= 0){
																	
																	// update loan types
																	if(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'].hasOwnProperty(loan_type)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] += 1;
																	}else{
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] = 1;
																	}
																	
																	// update from_date and to_date
																	if(new Date(GLOBAL.async_parser.date).valueOf() < new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].from_date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].from_date = GLOBAL.async_parser.date;
																	}
																	
																	if(new Date(GLOBAL.async_parser.date).valueOf() > new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].to_date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].to_date = GLOBAL.async_parser.date;
																	}
																	
																	if(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates.hasOwnProperty(GLOBAL.async_parser.date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates[GLOBAL.async_parser.date] += 1;
																	}else{
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates[GLOBAL.async_parser.date] = 1;
																	}
																	
																	// update data
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].numbers_of_loan += 1;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].amount_requested += Math.round(Number(GLOBAL.async_parser.current_amount_requested));
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].debt_to_income_ratio += Math.round(Number(GLOBAL.async_parser.debt_to_income_ratio.slice(0, -1)));
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].count_fico += count_fico;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].total_fico += temp_fico;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].count_vantage += count_vantage;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].total_vantage += temp_vantage;
																	GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].employment_length += employment_length;
																	
																	//
																	console.log('Zipcode: ' + GLOBAL.async_parser.current_zipcode );
																}
													}
													
													// count iteration
													GLOBAL.async_parser.count += 1;
												})
												.on("end", function(){
										   			// close readable stream
													GLOBAL.async_parser.ith_file += 1;
													if(GLOBAL.async_parser.ith_file === csv_files.length){
														var write_file_path = "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedRejectResultByNYZipcode.json";
														jsonfile.writeFile(write_file_path, GLOBAL.async_parser.manipulated_obj, function(err){
															if(err){
																console.log(err);
															}
														});
														
														console.log(JSON.stringify(GLOBAL.async_parser.manipulated_obj));
													}
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										});
									}


/* load classifier */
natural.BayesClassifier.load('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/rejectLoansClassifier.json', null, function(err, classifier){
	// classifier is ready to go
	GLOBAL.classifier = classifier;

	// start to parse
	GLOBAL.async_parser.parse_files(csv_files);
});
