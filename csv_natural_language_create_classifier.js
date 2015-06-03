/* required modules */
var natural = require('natural'),
	jsonfile = require('jsonfile'),
	natural = require('natural');

GLOBAL.classifier = new natural.BayesClassifier();
GLOBAL.classifier.events.on('trainedWithDocument', function (obj) {
   console.log(obj);
});
GLOBAL.training_set_path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/parsedRejectResultTrainingSet.json';
jsonfile.readFile(training_set_path, function(err, training_set){
	training_set.forEach(function(elem, index){
		GLOBAL.classifier.addDocument(elem.sentence, elem.keyword); 
	});
	
	// train classifier
	GLOBAL.classifier.train();
	
	// save classifier
	GLOBAL.classifier.save('/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/lending_club/rejectLoansClassifier.json', function(err, classifier){
		if (!err){
			console.log('done');
		}
	});
})