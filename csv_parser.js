/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv');

/* file paths */
var stream = fs.createReadStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3b.csv");
 
/* var */
var count = 0, keys;

var csvStream = csv()
    .on("data", function(data){
		if(count === 0){
			keys = data;
		}
         // console.log(data);
    })
    .on("end", function(){
         console.log("done");
		 console.log(keys);
    });
 
stream.pipe(csvStream);
