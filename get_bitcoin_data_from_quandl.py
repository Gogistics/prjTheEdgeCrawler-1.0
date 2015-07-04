# -*- coding: utf-8 -*-
import urllib2, json, time

class QuandlHandler():
    def __init__(self):
        self._quandl_urls = {
            'hitbtc' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/HITBTCUSD.json',
            'itbit' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/ITBITUSD.json',
            'lakebtc' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/LAKEUSD.json',
            'bitfinex' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/BITFINEXUSD.json',
            'btc_e' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/BTCEUSD.json'
            'bitstamp' : 'https://www.quandl.com/api/v1/datasets/BCHARTS/BITSTAMPUSD.json'
            'average' : 'https://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json'
        }
        
        
    def get_quandl_data(self):
        for key, val in self._quandl_urls.iteritems():
            resp = urllib2.urlopen(val)
            content = json.loads( resp.read() )

            today = time.strftime('%Y-%m-%d')
            file_name = "{platform}_{current_date}.txt".format(platform = key ,current_date = today)
            file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/quandl/', file_name = file_name)
            self.save_data(file_path, content)
        
    def save_data(self, arg_file_path, arg_data):
        try:
            with open(arg_file_path, 'a') as f:
                f.write(arg_data)
                return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True
        
if __name__ == "__main__":
    bitcoin_handler = QuandlHandler()
    bitcoin_handler.get_quandl_data()