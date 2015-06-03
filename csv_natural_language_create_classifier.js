/* required modules */
var natural = require('natural'),
	jsonfile = require('jsonfile');

GLOBAL.training_set_path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedRejectResultTrainingSet.json';
jsonfile.readFile(training_set_path, function(err, obj){
	console.log(obj);
})