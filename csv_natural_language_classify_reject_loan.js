/* required modules */
var natural = require('natural'),
	jsonfile = require("jsonfile");
	
// load classifier
natural.BayesClassifier.load('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/rejectLoansClassifier.json', null, function(err, classifier){
	GLOBAL.classifier = classifier;
});

// classify loans

