/* required modules */
var fs = require('fs'),
	csv = require('fast-csv'),
	async = require('async'),
	jsonfile = require('jsonfile'),
	natural = require('natural');
	
/* file paths */
var csv_files = ["/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3a.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3b.csv",
				"/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/LoanStats3c.csv"];
				
GLOBAL.async_parser = GLOBAL.async_parser || {};