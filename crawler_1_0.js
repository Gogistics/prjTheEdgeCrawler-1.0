# required modules
GLOBAL.crawler = require('crawler');
GLOBAL.mongojs = require('mongojs');
GLOBAL.cheerio = require('cheerio');

# init config.
GLOBAL.config_crawler = GLOABL.config_crawler || {};
GLOBAL.config_mongojs = GLOBAL.config_mongojs || {};

# config mongojs
config_mongojs.db_url = 'localhost/the_edge';
config_mongojs.db_collections = ['funding_lending'];

GLOBAL.my_mongo = mongojs.connect(config_mongojs.db_url, config_mongojs.db_collections);

# set new crawler
config_crawler.url = 'http://www.borro.com';
config_crawler.setting = {maxConnection : 10,
			forceUTF8 : true};
config_crawler.setting.callback = function(err, result){
	if(!err && result.statusCode == 200){
		var $ = cheerio.load(result.load);
		$('a').each(function(index, value){
			
		});
	}
};

GLOBAL.crawler_1 = new crawler(config_crawler.setting);
GLOBAL.crawler_1.queue(config_crawler.url);
