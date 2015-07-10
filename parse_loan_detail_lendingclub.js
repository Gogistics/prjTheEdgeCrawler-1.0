/* required modules */
var fs = require('fs'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural'),
	cheerio = require("cheerio");
	
/* */
var file_dir = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/media/';
var parse_html_to_json = function(arg_file_name){
	var file_path = file_dir + arg_file_name;
	fs.readFile(file_path, 'utf-8', function(err, file_html){
		if(file_html !== undefined){
			var $ = cheerio.load(file_html);
			$('tr').each(function(){
				var grade = $(this).find('td.rateAndAmountRequestd').find('div').find('span').text();
				var grade_number = $(this).find('td.rateAndAmountRequestd').find('div').find('span').find('span').text();
				console.log(grade + grade_number);
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