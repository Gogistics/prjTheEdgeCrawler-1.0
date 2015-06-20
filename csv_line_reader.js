var fs = require('fs');

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lines[+line_no]);
	
  	var data = lines[0].replace(/"/g, '');
	data = data.split(',');
	var index = data.indexOf('url');
	console.log(index);
	//
	lines.forEach(function(elem, index){
		if(index !== 0){
			data = elem.replace(/"/g, '');
			data = data.split(',');
			console.log(data[index]);
		}
	});
}

get_line('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv', 0, function(err, line){
  	/* var data = line.replace(/"/g, '');
	console.log(data);
	data = data.split(',');
	console.log(data);
	console.log(data[data.indexOf('url')]); */
	console.log('done...');
})