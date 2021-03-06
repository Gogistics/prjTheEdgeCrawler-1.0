/* required modules */
GLOBAL.crawler = require('crawler');
GLOBAL.mongojs = require('mongojs');
GLOBAL.cheerio = require('cheerio');

/* init config. */
GLOBAL.config_crawler = GLOBAL.config_crawler || {};
GLOBAL.config_mongojs = GLOBAL.config_mongojs || {};

// config mongojs
config_mongojs.db_url = 'localhost/the_edge';
config_mongojs.db_collections = ['market_x'];
GLOBAL.my_mongo = mongojs.connect(config_mongojs.db_url, config_mongojs.db_collections);

/* set new crawler */
GLOBAL.config_crawler.url = ['http://gsvcap.com/', 'http://www.wsj.com/', 'http://www.forbes.com/', 'http://www.nasdaq.com/'];
GLOBAL.config_crawler.setting = {maxConnection : 6,
								forceUTF8 : true,
								timeout : 8000,
								retries : 2,
								retryTimeout : 8000,
								skipDuplicates : true,
								};
								
GLOBAL.config_crawler.setting.info = function(arg_link, arg_txt){
	this.link = arg_link;
	this.text = arg_txt;
};
GLOBAL.config_crawler.setting.callback = function(err, result){
											if(!err && result.statusCode == 200){
												console.log('Got page body and start to parse...');
												var $ = cheerio.load(result.body);
												$('a').each(function(index, value){
													var sub_url = $(this).attr('href');
													
													if(sub_url !== undefined){
														var result = sub_url.match(/javascript|pdf|mailto|tel|\#/gi);
														if(!result){
															if(sub_url.indexOf('\/') === 0){
																sub_url = sub_url.substring(1);
										
															}
															if(sub_url.indexOf('http') !== 0){
																sub_url = GLOBAL.config_crawler.url + sub_url;
															}

															var str = $(this).text() || $(this).attr('title');
															if(str !== undefined){
																str = str.replace(/\t|\r|\n/gi, '').trim();
															}else{
																str = 'NA';
															}
															
															var uber_keyword = str.match(/uber|xiaomi|palantir|snapchat|spacex/gi);
															if(uber_keyword){
																// save info to mongodb
																var temp_info = new GLOBAL.config_crawler.setting.info(sub_url, str.toString("utf-8"));
																GLOBAL.my_mongo.market_x.update({'link' : sub_url}, temp_info, {upsert : true} ,function(err, saved_info){
																	if(!err){
																		console.log(saved_info);
																	}
																});
															}
															GLOBAL.crawler_1.queue( sub_url );

															// print
															// console.log('Text: ' + str + ' ; URL: ' + sub_url);
														}
													}
													// console.log(value);			
												});
											}
										};

// create new crawler
GLOBAL.crawler_1 = new crawler(GLOBAL.config_crawler.setting);

// start crawling (put a url to the crawler's queue)
GLOBAL.crawler_1.queue(GLOBAL.config_crawler.url);
