/* required modules */
var fs = require('fs'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural'),
	cheerio = require("cheerio");
	
/* */
var save_file = function(arg_file, arg_file_name){
	var write_file_path = file_dir + arg_file_name + '.json' ;
	console.log(arg_file);
	console.log(write_file_path);
	jsonfile.writeFile(write_file_path, arg_file, function(err){
		if(err){
			console.log(err);
		}
	});
}
var file_dir = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/media/',
	data_ary = [];
var parse_html_to_json = function(arg_file_name){
	var data_json = {};
	var file_path = file_dir + arg_file_name;
	fs.readFile(file_path, 'utf-8', function(err, file_html){
		if(file_html !== undefined){
			var $ = cheerio.load(file_html);
			$('tr').each(function(){
				
				var grade = $(this).find('td.rateAndAmountRequested')
								.find('div')
								.find('span.master_pngfix')
								.clone()    //clone the element
						        .children() //select all the children
						        .remove()   //remove all the children
						        .end()  //again go back to selected element
						        .text()
								.trim(),
					grade_number = $(this).find('td.rateAndAmountRequested').find('div').find('span').find('span').text().trim(),
					rate = $(this).find('td.rateAndAmountRequested').find('div').find('strong').text().trim(),
					loan_type_length = $(this).find('td.yui-dt1-col-typeAndTerm').find('div').find('span').text().trim(),
					fico = $(this).find('td.yui-dt1-col-fico').find('div.ficoDisplay').text().trim(),
					total_amount = $(this).find('td.yui-dt1-col-totalAmount').find('div.amountCol').text().trim(),
					loan_purpose = $(this).find('td.yui-dt1-col-titleAndPurpose').find('span.loan_purpose').text().trim(),
					id = $(this).find('td.yui-dt1-col-titleAndPurpose').find('a.expand-loan-details').attr('href'),
					percent_funded = $(this).find('td.yui-dt1-col-unfundedAmount').find('div.percent_funded').text().trim(),
					amount_left = $(this).find('td.yui-dt1-col-timeAndAmountLeft').find('div.timeDisplay').slice(0).eq(0).text(),
					days_left = $(this).find('td.yui-dt1-col-timeAndAmountLeft').find('div.timeDisplay').slice(1).eq(0).text();
					
				var number_pattern = /\d+/g;	
				id = id.match(number_pattern)[0];
				days_left = days_left.match(number_pattern)[0];
				
				data_json['id'] = id;
				data_json['grade'] = grade;
				data_json['grade_number'] = grade_number;
				data_json['rate'] = rate;
				data_json['loan_type_length'] = loan_type_length;
				data_json['fico'] = fico;
				data_json['total_amount'] = total_amount;
				data_json['loan_purpose'] = loan_purpose;
				data_json['percent_funded'] = percent_funded;
				data_json['amount_left'] = amount_left;
				data_json['days_left'] = days_left;
				data_ary.push(data_json);
			});
		}
		
		// file name
		var file_name = arg_file_name.substring(0,arg_file_name.indexOf('.'));
		save_file(data_ary, file_name);
	});
	
	
}
var parser_callback = function(err, files){
	files.forEach(function(file, index){
		console.log(file);
		if(file !== undefined){
			parse_html_to_json(file);
		}
	});
}

var get_and_parse_data = function(){
	fs.readdir(file_dir, parser_callback);
}

/**/
get_and_parse_data();