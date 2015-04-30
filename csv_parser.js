/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv');

/* file paths */
var csvReadStream = fs.createReadStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv");
 
/* var */
var count = 0, keys;

var csvReadableStream = csv()
    .on("data", function(data){
		if(count === 0){
			keys = data;
		}
		count += 1;
         // console.log(data);
    })
    .on("end", function(){
         console.log("done");
		 console.log(keys);
    });
 
csvReadStream.pipe(csvReadableStream);
