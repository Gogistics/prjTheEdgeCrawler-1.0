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

/* get info. from LendingClub url (backup mechanism) */
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
														GLOBAL.async_parser.state_index = GLOBAL.async_parser.keys.indexOf("addr_state");
														GLOBAL.async_parser.current_state = data[GLOBAL.async_parser.state_index];
														
														GLOBAL.async_parser.zipcode_index = GLOBAL.async_parser.keys.indexOf("zip_code");
														GLOBAL.async_parser.current_zipcode = data[GLOBAL.async_parser.zipcode_index];
													
														// get annual inc
														GLOBAL.async_parser.amount_requested_index = GLOBAL.async_parser.keys.indexOf("loan_amnt");
														GLOBAL.async_parser.current_amount_requested = data[GLOBAL.async_parser.amount_requested_index];
													
														// get loan amnt
														GLOBAL.async_parser.debt_to_income_ratio_index = GLOBAL.async_parser.keys.indexOf("dti");
														GLOBAL.async_parser.debt_to_income_ratio = data[GLOBAL.async_parser.debt_to_income_ratio_index];
														// console.log(GLOBAL.async_parser.debt_to_income_ratio);
														var temp_debt_to_inc_ratio = undefined;
														if(GLOBAL.async_parser.debt_to_income_ratio !== undefined){
															temp_debt_to_inc_ratio = Number(GLOBAL.async_parser.debt_to_income_ratio);
														}
														
														// get date (not done; get date from web-page)
														GLOBAL.async_parser.id_index = GLOBAL.async_parser.keys.indexOf("id");
														GLOBAL.async_parser.id = data[GLOBAL.async_parser.id_index];
														
														if(GLOBAL.async_parser.id !== undefined && !isNaN(GLOBAL.async_parser.id) ){
															var body;
															try{
																var file_path = './lendingclub/loan_stats_' + GLOBAL.async_parser.id + '.txt' ;
																body = fs.readFileSync(file_path).toString();
																console.log('working fine...');
															}catch( err ){
																console.log('sth wrong...');
																var url = 'https://www.lendingclub.com/browse/loanDetail.action?loan_id=' + GLOBAL.async_parser.id;
																var res = sync_request('GET', url);
																body = res.getBody();
																if ( body === undefined || body === null ) return false;
															}finally{
																console.log(GLOBAL.async_parser.id);
																if ( body === undefined || body === null ) return false;
																//
																var $ = cheerio.load(body);
																$('table.loan-details').each(function(){
																	var table = this;
																	$(table).find('th').each(function(){
																		if($(this).text() == 'Loan Submitted on'){
																			GLOBAL.async_parser.date = $(this).parent().find('td').text();
																		}
																	});
																});
																var day_regex = /\d+(\/|\-)\d+(\/|\-)\d+/;
																GLOBAL.async_parser.date = day_regex.exec(GLOBAL.async_parser.date)[0];
																day_regex = /(\d+)/g;
																var month_day_year_ary = GLOBAL.async_parser.date.match(day_regex),
																	current_year = '', current_month = '', current_day = '';
																current_year = ( Number(month_day_year_ary[2]) + 2000 ).toString();
																if(month_day_year_ary[0] < 10){
																	current_month = '0' + month_day_year_ary[0].toString();
																}else{
																	current_month = month_day_year_ary[0].toString();
																}
																if(month_day_year_ary[1] < 10){
																	current_day = '0' + month_day_year_ary[1].toString();
																}else{
																	current_day = month_day_year_ary[1].toString();
																}
																GLOBAL.async_parser.date = current_year + '-' + current_month + '-' + current_day;
																GLOBAL.async_parser.current_date_of_loan = GLOBAL.async_parser.date;
																if( ( Number(month_day_year_ary[2]) + 2000 ) < 2007 || ( Number(month_day_year_ary[2]) + 2000 ) > 2014){
																	console.log(GLOBAL.async_parser.date);
																}
															}
														}else{
															return false;
														}
														
														// get risk score
														GLOBAL.async_parser.fico_range_high_index = GLOBAL.async_parser.keys.indexOf("fico_range_high");
														GLOBAL.async_parser.fico_range_high = data[GLOBAL.async_parser.fico_range_high_index];
														GLOBAL.async_parser.fico_range_low_index = GLOBAL.async_parser.keys.indexOf("fico_range_low");
														GLOBAL.async_parser.fico_range_low = data[GLOBAL.async_parser.fico_range_low_index];
														GLOBAL.async_parser.risk_score = Math.round( ( Number(GLOBAL.async_parser.fico_range_high) + Number(GLOBAL.async_parser.fico_range_low) ) / 2 );
														
														
														// get loan title
														GLOBAL.async_parser.loan_title_index = GLOBAL.async_parser.keys.indexOf("purpose");
														if(data[GLOBAL.async_parser.loan_title_index] === undefined){
															GLOBAL.async_parser.loan_title = 'other';
														}else{
															GLOBAL.async_parser.loan_title = data[GLOBAL.async_parser.loan_title_index].toLowerCase();
															GLOBAL.async_parser.loan_title = GLOBAL.async_parser.loan_title.replace(/^\w\s/gi, ' '); // remove all special characters
															
														}
														var loan_type = GLOBAL.classifier.classify(GLOBAL.async_parser.loan_title);
														if(loan_type === undefined || loan_type === null){
															loan_type = "other";
														}
														
														// get employment length
														GLOBAL.async_parser.employment_length_index = GLOBAL.async_parser.keys.indexOf("emp_length");
														GLOBAL.async_parser.employment_length = data[GLOBAL.async_parser.employment_length_index];
														
														// prevent undefined emply. length
														var employment_length = 0,
															emply_length_key = 'less_than_1';
														if(GLOBAL.async_parser.employment_length !== undefined){
															var regex_smaller_sign = /\</g,
															regex_plus_sign = /\+/g,
															regex_employment_length = /\d+/g,
															temp_employment_length = GLOBAL.async_parser.employment_length.match(regex_employment_length);
														
															if(GLOBAL.async_parser.employment_length.match(regex_smaller_sign)){
																employment_length = 0.5;
																emply_length_key = 'less_than_1';
															}else if(GLOBAL.async_parser.employment_length.match(regex_plus_sign)){
																employment_length = 10.5;
															emply_length_key = 'longer_than_10';
															}else if(temp_employment_length === undefined || temp_employment_length === null){
																employment_length = 0;
																emply_length_key = '0';
															}else{
																employment_length = Number(temp_employment_length[0]);
																emply_length_key = temp_employment_length[0];
															}
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
														
														// build new structure
														if( GLOBAL.async_parser.id !== undefined &&
															!isNaN(GLOBAL.async_parser.id) &&
															GLOBAL.async_parser.current_state !== undefined &&
															GLOBAL.async_parser.current_state === "CA" &&
															GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
															temp_debt_to_inc_ratio >= 0 &&
															!(GLOBAL.async_parser.current_zipcode in GLOBAL.async_parser.manipulated_obj) ){
																
																// get current date
																var current_date = GLOBAL.async_parser.date;
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
																															
																// build dates obj
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['dates'] = {};
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['dates'][current_date] = 1;
																// console.log('Zipcode: ' + GLOBAL.async_parser.current_zipcode );
																
																// build loan type obj
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'] = {};
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] = 1;
																
																//
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['emply_length'] = {};
																GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['emply_length'][emply_length_key] = 1;
																
																
														}else if(GLOBAL.async_parser.id !== undefined &&
																!isNaN(GLOBAL.async_parser.id) &&
																GLOBAL.async_parser.current_state !== undefined &&
																GLOBAL.async_parser.current_state === "CA" &&
																GLOBAL.async_parser.current_state === GLOBAL.async_parser.current_state.toUpperCase() &&
																temp_debt_to_inc_ratio >= 0){
																	
																	// update from_date and to_date
																	if(new Date(GLOBAL.async_parser.date).valueOf() < new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].from_date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].from_date = GLOBAL.async_parser.date;
																	}
																	
																	if(new Date(GLOBAL.async_parser.date).valueOf() > new Date(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].to_date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].to_date = GLOBAL.async_parser.date;
																	}
																	
																	//
																	if(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates.hasOwnProperty(GLOBAL.async_parser.date)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates[GLOBAL.async_parser.date] += 1;
																	}else{
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode].dates[GLOBAL.async_parser.date] = 1;
																	}
																	
																	// update loan types
																	if(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'].hasOwnProperty(loan_type)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] += 1;
																	}else{
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['loan_types'][loan_type] = 1;
																	}
																	
																	// update loan types
																	if(GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['emply_length'].hasOwnProperty(emply_length_key)){
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['emply_length'][emply_length_key] += 1;
																	}else{
																		GLOBAL.async_parser.manipulated_obj[GLOBAL.async_parser.current_zipcode]['emply_length'][emply_length_key] = 1;
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
																	// console.log('Zipcode: ' + GLOBAL.async_parser.current_zipcode );
																}
													}
													
													// count iteration
													GLOBAL.async_parser.count += 1;
												})
												.on("end", function(){
										   			// close readable stream
													GLOBAL.async_parser.ith_file += 1;
													if(GLOBAL.async_parser.ith_file === csv_files.length){
														var write_file_path = "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedLoanStatsResultByCAZipcode.json";
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

/* end of parser */