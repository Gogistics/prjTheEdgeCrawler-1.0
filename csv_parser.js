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
GLOABL.async_parser.csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedResult.csv");
GLOABL.async_parser.csvWritableStream.on("finish", function(){
	console.log("finish parsing the file...")
});
GLOABL.async_parser.csvWriteStream = csv.createWriteStream({ headers : true });
GLOABL.async_parser.count = 0;
GLOABL.async_parser.keys = [];
GLOABL.async_parser.manipulated_obj = {};
GLOABL.async_parser.csvWriteStream.pipe(GLOABL.async_parser.csvWritableStream);
GLOBAL.async_parser.parse_files = function (arg_files){
										async.forEach(arg_files, function(file_path, callback){
											var csvReadStream = fs.createReadStream(file_path);
											var csvReadableStream = csv()
												.on("data", function(data){
													if(GLOABL.async_parser.count === 0){
														GLOABL.async_parser.keys = data;
														console.log(GLOABL.async_parser.keys);
													}else{
														GLOABL.async_parser.addr_state_index = GLOABL.async_parser.keys.indexOf("addr_state");
														GLOABL.async_parser.current_addr_state = data[GLOABL.async_parser.addr_state_index];
													
														// get annual inc
														GLOABL.async_parser.annual_inc_index = GLOABL.async_parser.keys.indexOf("annual_inc");
														GLOABL.async_parser.current_annual_inc = data[GLOABL.async_parser.annual_inc_index];
													
														// get loan amnt
														GLOABL.async_parser.loan_amnt_index = keys.indexOf("loan_amnt");
														GLOABL.async_parser.current_loan_amnt = data[GLOABL.async_parser.loan_amnt_index];
													
														//
														if( GLOABL.async_parser.current_addr_state !== undefined &&
															GLOABL.async_parser.current_addr_state !== "" &&
															!(GLOABL.async_parser.current_addr_state in GLOABL.async_parser.manipulated_obj)){
															GLOABL.async_parser.manipulated_obj[GLOABL.async_parser.current_addr_state] = { addr_state : GLOABL.async_parser.current_addr_state,
																																			numbers_of_loan : 1,
																																			total_annual_inc : Number(GLOABL.async_parser.current_annual_inc),
																																			total_loan_amnt : Number(GLOABL.async_parser.current_loan_amnt)};
														}else if(GLOABL.async_parser.current_addr_state !== undefined &&
															GLOABL.async_parser.current_addr_state !== ""){
															//
															GLOABL.async_parser.manipulated_obj[current_addr_state].numbers_of_loan += 1;
															GLOABL.async_parser.manipulated_obj[current_addr_state].total_annual_inc += Number(GLOABL.async_parser.current_annual_inc);
															GLOABL.async_parser.manipulated_obj[current_addr_state].total_loan_amnt += Number(GLOABL.async_parser.current_loan_amnt);
														}
													
														GLOABL.async_parser.count += 1;
													}
												})
												.on("end", function(){
										   			// close readable stream
										            console.log("end readable stream");
											   		for (var key in GLOABL.async_parser.manipulated_obj) {
											   		   	if (GLOABL.async_parser.manipulated_obj.hasOwnProperty(key)) {
											   		     	GLOABL.async_parser.csvWriteStream.write(GLOABL.async_parser.manipulated_obj[key]);
											   		   	}
											   		}
												});
												
												// start to parse file
												csvReadStream.pipe(csvReadableStream);
										}, function(err){
											if(err){
												console.log(err);
											}else{
												GLOABL.async_parser.csvWriteStream.end();
												console.log("done with parsing files");
											}
										});
									}

// start to parse
GLOBAL.async_parser.parse_files();
/* end of parser */


// /* old simple parser for single file */
// // csv writable stream
// var csvWriteStream = csv.createWriteStream({ headers : true }),
//     csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedLoanStats3c.csv");
// csvWritableStream.on("finish", function(){
// 	console.log("done with writable stream.");
// });
// csvWriteStream.pipe(csvWritableStream);
//
// /* readable stream */
// // opens the file as a readable stream
// var csvReadStream = fs.createReadStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3c.csv");
// var count = 0, keys,
// 	addr_state_index, current_addr_state,
// 	numbers_of_loan,
// 	annual_inc_index, current_annual_inc,
// 	loan_amnt_index, current_loan_amnt,
// 	manipulated_obj = {};
// var csvReadableStream = csv()
//     .on("data", function(data){
// 		if(count === 0){
// 			keys = data;
// 			console.log(keys);
// 		}else{
// 			// get addr_state
// 			addr_state_index = keys.indexOf("addr_state");
// 			current_addr_state = data[addr_state_index];
// 			// get annual inc
// 			annual_inc_index = keys.indexOf("annual_inc");
// 			current_annual_inc = data[annual_inc_index];
// 			// get loan amnt
// 			loan_amnt_index = keys.indexOf("loan_amnt");
// 			current_loan_amnt = data[loan_amnt_index];
// 			if(current_addr_state !== undefined && current_addr_state !== "" && !(current_addr_state in manipulated_obj)){
// 				manipulated_obj[current_addr_state] = { addr_state : current_addr_state, numbers_of_loan : 1, total_annual_inc : Number(current_annual_inc), total_loan_amnt : Number(current_loan_amnt)};
// 			}else if(current_addr_state !== undefined && current_addr_state !== ""){
// 				manipulated_obj[current_addr_state].numbers_of_loan += 1;
// 				manipulated_obj[current_addr_state].total_annual_inc += Number(current_annual_inc);
// 				manipulated_obj[current_addr_state].total_loan_amnt += Number(current_loan_amnt);
// 			}
// 		}
// 		count += 1;
//     })
//     .on("end", function(){
// 		// close readable stream
//          console.log("done");
// 		 for (var key in manipulated_obj) {
// 		   	if (manipulated_obj.hasOwnProperty(key)) {
// 		     	csvWriteStream.write(manipulated_obj[key]);
// 		   	}
// 		 }
// 		 csvWriteStream.end(); // close writable stream
//     });
//
// // start to parse file
// csvReadStream.pipe(csvReadableStream);
