/* required modules */
var fs = require('fs'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural'),
	cheerio = require("cheerio");
	
/* */
var parse_html_to_json = function(arg_file_path){
	console.log();
	fs.readFile(arg_file_path, 'utf-8', function(err, file_html){
		var $ = cheerio.load(file_html);
		$('tr').each(function(index, value){
			var grade = $('td').find('.rateAndAmountRequestd').find('span').text();
			var grade_number = $('td').find('.rateAndAmountRequestd').find('span').find('span').text();
			console.log(grade);
			console.log(grade_number);
		});
	});
}
var parser_callback = function(err, files){
	files.forEach(function(file, index){
		console.log(file);
		parse_html_to_json(file);
	});
}

var file_dir = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/media';
var get_and_parse_data = function(){
	fs.readdir(file_dir, parser_callback);
}

/**/
get_and_parse_data();