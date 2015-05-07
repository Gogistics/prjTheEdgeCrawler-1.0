var natural = require('natural'),
  tokenizer = new natural.RegexpTokenizer({pattern: /\,|\s/}),
  keywords = tokenizer.tokenize("my dog hasn't any fleas,yes you,my  has");

var unique_keywords = keywords.filter(function(elem, pos){
	return keywords.indexOf(elem) == pos;
});

console.log(unique_keywords);
