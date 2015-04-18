# required modules
GLOBAL.crawler = require('crawler');
GLOBAL.mongojs = require('mongojs');

# init config.
GLOBAL.config_crawler = GLOABL.config_crawler || {};
GLOBAL.config_mongojs = GLOBAL.config_mongojs || {};

# config mongojs
config_mongojs.db_url = '';
config_mongojs.db_collections = [''];

GLOBAL.my_mongo = mongojs.connect(config_mongojs.db_url, config_mongojs.db_collections);

# set new crawler
GLOBAL.crawler_1 = new crawler();
