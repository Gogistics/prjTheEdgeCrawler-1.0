# -*- coding: utf-8 -*-
import urllib2, json, time, csv

class StockPriceHandler():
    def __init__(self):
        self._quandl_urls = {
            'lendingclub' : 'http://download.finance.yahoo.com/d/quotes.csv?s=LC&f=sl1d1t1c1ohgv&e=.csv',
            'lendingtree' : 'http://download.finance.yahoo.com/d/quotes.csv?s=TREE&f=sl1d1t1c1ohgv&e=.csv',
            'tslx' : 'http://download.finance.yahoo.com/d/quotes.csv?s=TSLX&f=sl1d1t1c1ohgv&e=.csv'
        }
        
        
    def get_csv(self):
        for key, val in self._quandl_urls.iteritems():
            resp = urllib2.urlopen(val)
            content = resp.read()
            
            today = time.strftime('%Y-%m-%d')
            file_name = "{platform}_{current_date}.csv".format(platform = key ,current_date = today)
            file_dir = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/stock_market/lending/{sub_dir}/'.format( sub_dir = key)
            file_path = "{file_dir}{file_name}".format( file_dir = file_dir, file_name = file_name )
            self.save_csv(file_path, content)
        
    def save_csv(self, arg_file_path, arg_data):
        try:
            with open(arg_file_path, 'a') as f:
                f.write(arg_data)
                return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True
        
if __name__ == "__main__":
    bitcoin_handler = StockPriceHandler()
    bitcoin_handler.get_csv()