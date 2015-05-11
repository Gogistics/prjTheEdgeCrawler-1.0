var converter = require("csvtojson").core.Converter,
	jsonfile = require("jsonfile"),
    csv = require('fast-csv'),
	fs = require("fs");

//
var csv_files = { keywords_personal : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_personal.csv",
							keywords_business : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_business.csv",
							keywords_other : "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsed_keywords_other.csv" };
						

/*  */
GLOBAL.data_obj = GLOBAL.data_obj || { name : "keywords_of_reject_loans", children : [] };
GLOBAL.convert_files = function(arg_file_paths){
	for( key in csv_files ){
		if( csv_files.hasOwnProperty(key) ){
			GLOBAL.build_data_obj(key, csv_files[key]);
		}
	}
}

// method 1.
GLOBAL.convert_csv_to_json = function(arg_key, arg_file_path){
	var fileStream = fs.createReadStream(arg_file_path);
	var csvConverter = new Converter({ constructResult : true });
	
	csvConverter.on("end_parsed", function(json_obj){
		console.log(json_obj);
	});
}

// method 2.
GLOBAL.create_json_file = function(){
	var write_file_path = "/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/keywords_reject_loans.json";
	jsonfile.writeFile(write_file_path, GLOBAL.data_obj, function(err){
		if(err){
			console.log(err);
		}
	});
}

GLOBAL.build_data_obj = function(arg_key, arg_file_path){
	var csv_keys, count = 0, current_data = { name : arg_key, children : []};
	var csvReadStream = fs.createReadStream(arg_file_path);
	var csvReadableStream = csv()
						.on("data", function(data){
							if(count === 0){
								csv_keys = data;
							}else{
								var keyword_index = csv_keys.indexOf("keyword"), keyword_number_index = csv_keys.indexOf("number");
								var keyword = data[keyword_index], keyword_number = data[keyword_number_index];
								current_data["children"].push( { name : keyword, size : keyword_number });
							}
							count += 1;
						})
						.on("end", function(){
							// before push data to array, do sorting first
							current_data["children"] = GLOBAL.quick_sort( current_data["children"] );
							console.log(current_data);
							// push data into ary
							GLOBAL.data_obj.children.push(current_data);
							if(arg_key === "keywords_other"){
								// start to parse data
								GLOBAL.create_json_file();
							}
						});
						
	// start to parse file
	csvReadStream.pipe(csvReadableStream);
}

GLOBAL.quick_sort = function(arg_data_ary){
	var smaller_ary = [], pivot_ary = [], bigger_ary = [];
	
	if(arg_data_ary.length <= 1){
		return arg_data_ary;
	}else{
		var pivot_value = Number( arg_data_ary[0].size );
		
		for( var key in arg_data_ary){
			if( Number( arg_data_ary[key].size ) < pivot_value ){
				smaller_ary.push( arg_data_ary[key] );
			}else if( Number( arg_data_ary[key].size ) > pivot_value ){
				bigger_ary.push( arg_data_ary[key] );
			}else{
				pivot_ary.push( arg_data_ary[key] );
			}
		}
		
		//
		smaller_ary = GLOBAL.quick_sort(smaller_ary);
		bigger_ary = GLOBAL.quick_sort(bigger_ary);
		
		return bigger_ary.concat(pivot_ary).concat(smaller_ary);
	}
}

// start to convert
GLOBAL.convert_files(csv_files);