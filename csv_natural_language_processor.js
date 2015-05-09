/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv'),
	async = require('async'),
	natural = require('natural');

/* file paths */
var csv_files_for_parse = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsA.csv",
						"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/RejectStatsB.csv"];
						
var csv_files_of_keywords = { keywords_personal : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_personal.csv",
							  keywords_business : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_business.csv",
							  keywords_other : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_other.csv",
							  keywords_temp : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_temp.csv" };
						
/* build keyword objects */
GLOBAL.keyword_sets = GLOBAL.keyword_sets || {};
GLOBAL.build_keyword_sets = function(arg_file_paths){
	for( key in arg_file_paths){
		if( arg_file_paths.hasOwnProperty(key) ){
			GLOBAL.get_keywords(key, arg_file_paths);
		}
	}
}

GLOBAL.get_keywords = function(arg_key, arg_file_paths){
	GLOBAL.keyword_sets[arg_key] = [];
	var csv_keys, count = 0;
	var csvReadStream = fs.createReadStream(arg_file_paths[arg_key]);
	var csvReadableStream = csv()
						.on("data", function(data){
							if(count === 0){
								csv_keys = data;
							}else{
								var keyword_index = csv_keys.indexOf("keyword"), keyword_number_index = csv_keys.indexOf("number");
								var keyword = data[keyword_index], keyword_number = data[keyword_number_index];
								
								GLOBAL.keyword_sets[arg_key].push( { keyword : keyword, number : keyword_number } );
							}
							count += 1;
						})
						.on("end", function(){
							if(arg_key === "keywords_other"){
								console.log("done...");
								console.log(JSON.stringify(GLOBAL.keyword_sets, 2, 2));
								
								// start to parse data
								GLOBAL.async_nlp.parse_files(csv_files_for_parse);
							}
						});
						
	// start to parse file
	csvReadStream.pipe(csvReadableStream);
}
/* end */

/*===========================================*/

/* node.js NLP for multiple files with async */
GLOBAL.tokenizer = new natural.RegexpTokenizer({ pattern : /\s|\_/});
GLOBAL.async_nlp = GLOBAL.async_nlp || {};
GLOBAL.async_nlp.count = 0, GLOBAL.async_nlp.ith_file = 0;
GLOBAL.async_nlp.keys = [];
GLOBAL.async_nlp.manipulated_obj = {};
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
														GLOBAL.async_nlp.loan_title = data[GLOBAL.async_nlp.loan_title_index].toLowerCase();
														GLOBAL.async_nlp.loan_title = GLOBAL.async_nlp.loan_title.replace(/^\w\s/gi, ' '); // remove all special characters
														
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
																
																// tokenize string
																var tokenized_ary = GLOBAL.tokenizer.tokenize(GLOBAL.async_nlp.loan_title);
																var unique_ary = tokenized_ary.filter(function(elem, pos) {
																				  	return tokenized_ary.indexOf(elem) == pos;
																				  });
																				  
																// get keywords
																var personal_score = 0, business_score = 0, other_score = 0, score_valuation = 0;
																unique_ary.forEach(function(keyword, index_2){
																  	for( key in GLOBAL.keyword_sets){
																  		if( GLOBAL.keyword_sets.hasOwnProperty(key) && key !== "keywords_temp"){
																  			var keywords_ary = GLOBAL.keyword_sets[key];
																			keywords_ary.forEach(function(keyword_info, index_2){
																					var score = natural.JaroWinklerDistance(keyword_info.keyword, keyword);
																					if( score > 0.8 && score > score_valuation){
																						score_valuation = score;
																						keyword_info.number = Number(keyword_info.number) + 1;
																						console.log(keyword_info.number);
																						// assign score to the corresponding tag
																						if(key === "keywords_personal"){
																							personal_score = score_valuation;
																						}else if(key === "keywords_business"){
																							business_score = score_valuation;
																						}else if(key === "keywords_other"){
																							other_score = score_valuation;
																						}
																						console.log('Score set: ' + JSON.stringify([business_score, personal_score, other_score]));
																					}
																				
																			});
																  		}
																  	};
																	
																	if( score_valuation <= 0.8 &&
																		GLOBAL.keyword_sets.keywords_temp.indexOf(keyword) === -1 &&
																		GLOBAL.keyword_sets.keywords_temp.length < 200){
																			GLOBAL.keyword_sets.keywords_temp.push(keyword);
																	};
																});
																
																
														}
													}
													
													// count iteration
													GLOBAL.async_nlp.count += 1;
												})
												.on("end", function(){
													GLOBAL.async_nlp.ith_file += 1;
													if(GLOBAL.async_nlp.ith_file === csv_files_for_parse.length){
														console.log(GLOBAL.keyword_sets);
													}
													
													//
													// GLOBAL.async_nlp.ith_file += 1;
// 													if(GLOBAL.async_nlp.ith_file === csv_files_for_parse.length){
// 														var csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_of_loan_title.csv");
// 														csvWritableStream.on("finish", function(){
// 															console.log("finish parsing the file...")
// 														});
//
// 														for(key in csv_files_of_keywords){
// 															var keywords = GLOBAL.keyword_sets[key];
// 															var csvWriteStream = csv.createWriteStream({ headers : true });
// 															csvWriteStream.pipe(csvWritableStream);
// 	 											   		    csvWriteStream.write("");
// 	 														csvWriteStream.end();
// 														}
// 														console.log("done...");
// 											   		};
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										});
									};
									
GLOBAL.get_max = function(numArray) {
  return Math.max.apply(null, numArray);
}
// start to get keywords and then parse data
GLOBAL.build_keyword_sets(csv_files_of_keywords);
