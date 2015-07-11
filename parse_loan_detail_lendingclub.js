/* required modules */
var fs = require('fs'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural'),
	cheerio = require("cheerio");
	
/* */
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
					purpose = $(this).find('td.yui-dt1-col-titleAndPurpose').find('span.loan_purpose').text().trim(),
					id = $(this).find('td.yui-dt1-col-titleAndPurpose').find('a.expand-loan-details').attr('href'),
					purpose = $(this).find('td.yui-dt1-col-unfundedAmount').find('div.percent_funded').text().trim(),
					amount_left = $(this).find('td.yui-dt1-col-timeAndAmountLeft').find('div.timeDisplay').slice(0).eq(0).text();
					
				var number_pattern = /\d+/g;	
				id = id.match(number_pattern)[0];
				
				data_json['id'] = id;
				data_json['grade'] = grade;
				data_json['grade_number'] = grade_number;
				data_json['rate'] = rate;
				data_json['loan_type_length'] = loan_type_length;
				data_json['fico'] = fico;
				data_json['total_amount'] = total_amount;
				data_json['purpose'] = purpose;
				data_json['amount_left'] = amount_left;
					
				console.log(data_json);
			});
		}
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