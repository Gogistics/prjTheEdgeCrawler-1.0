/* required */
var fs = require('fs');

/* file paths */
var files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv",
			"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3b.csv",
			"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3c.csv"];
	
function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lines[+line_no]);
	
	//
	lines.forEach(function(elem, ith){
		if(ith !== 0){
			var url_regex = /https.+loan_id=\d+/g;
				url = url_regex.exec(elem);
				
				try{
					console.log(url[0]);
				}catch(err) {
				    console.log(elem);
				}
		}
	});
}

files.forEach(function(path, ith){
	get_line(path, 0, function(err, line){
	  	/* var data = line.replace(/"/g, '');
		console.log(data);
		data = data.split(',');
		console.log(data);
		console.log(data[data.indexOf('url')]); */
		console.log('done...');
	})
	
});