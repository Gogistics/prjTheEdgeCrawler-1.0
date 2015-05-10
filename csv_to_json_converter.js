var converter = require("csvtojson").core.Converter;
var fs = require("fs");

//
var csv_parsed_keywords = { keywords_personal : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_personal.csv",
							  keywords_business : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_business.csv",
							  keywords_other : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_other.csv",
							  keywords_temp : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_temp.csv" };
						

GLOBAL.convert_files = function(arg_file_paths){
	for( key in csv_parsed_keywords ){
		if( csv_parsed_keywordshasOwnProperty(key) ){
			GLOBAl.convert_csv_to_json( key, csv_parsed_keywords[key]);
		}
	}
}

GLOBAl.convert_csv_to_json = function(arg_key, arg_file_path){
	var fileStream = fs.createReadStream(arg_file_path);
}