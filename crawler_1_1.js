var sync_request = require('sync-request'),
    cheerio = require("cheerio"),
	url = require('url');

// sample 1.
	/*
request('https://news.ycombinator.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
		console.log(response);
        $('span.comhead').each(function(i, element){
            var a = $(this).prev();
            var rank = a.parent().parent().text();
            var title = a.text();
            var url = a.attr('href');
            var subtext = a.parent().parent().next().children('.subtext').children();
            var points = $(subtext).eq(0).text();
            var username = $(subtext).eq(1).text();
            var comments = $(subtext).eq(2).text();
			
            // parsed meta data object
            var metadata = { rank: parseInt(rank), title: title, url: url, points: parseInt(points), username: username, comments: parseInt(comments) };
            console.log(metadata);
        });
    }
});
	*/

// sample 2.
GLOBAL.request_loan_detail = function(arg_url){
	var res = sync_request('GET', arg_url);
	return res.getBody();
}
var body = GLOBAL.request_loan_detail('https://www.lendingclub.com/browse/loanDetail.action?loan_id=29194030');
console.log(body);


