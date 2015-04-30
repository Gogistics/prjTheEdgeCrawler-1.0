/* required modules */
var fs = require('fs'), 
    csv = require('fast-csv');

/* file paths */
var csvReadStream = fs.createReadStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv");

var csvWriteStream = csv.createWriteStream({ headers : true }),
    csvWritableStream = fs.createWriteStream("/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedLoanStats3a.csv");
csvWritableStream.on("finish", function(){
	console.log("done with writable stream.");
});
csvWriteStream.pipe(csvWritableStream);

/* readable stream */
var count = 0, keys, addr_state_index, curent_addr_state, manipulated_obj = [];
var csvReadableStream = csv()
    .on("data", function(data){
		if(count === 0){
			keys = data;
			// csvWriteStream.write(keys);
		}else{
			addr_state_index = keys.indexOf("addr_state");
			curent_addr_state = data[addr_state_index];
			csvWriteStream.write({ addr_state : curent_addr_state});
		}
		count += 1;
    })
    .on("end", function(){
         console.log("done");
		 csvWriteStream.end();
    });
 
csvReadStream.pipe(csvReadableStream);
