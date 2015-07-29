# -*- coding: utf-8 -*-
import urllib2, json, time, csv, re
from bs4 import BeautifulSoup as _bs4

class StockPriceHandler():
    def __init__(self):
        self._quandl_urls = {
            'ftse' : 'http://finance.yahoo.com/q?s=^ftse',
            'sse_composite' : 'http://finance.yahoo.com/q?s=000001.ss',
            'hsi' : 'http://finance.yahoo.com/q?s=^hsi',
            'gspc' : 'http://finance.yahoo.com/q?s=^gspc',
            'nasdaq' : 'http://finance.yahoo.com/q?s=%5EIXIC',
            'dji' : 'http://finance.yahoo.com/q?s=^dji'
        }
        
        
    def get_csv(self):
        for key, val in self._quandl_urls.iteritems():
            resp = urllib2.urlopen(val)
            content = resp.read()
            soup = _bs4(content)
            summary = {}
            
            div_index_summary = soup.find('div', {'class' : 'yfi_rt_quote_summary_rt_top'})
            index_current_value = div_index_summary.find('span', {'class' : 'time_rtq_ticker'}).text.strip()
            summary['value'] = index_current_value
            
            # summary
            change_summary = div_index_summary.find('span', {'class' : 'time_rtq_content'}).find_all('span')
            index_current_up_or_down = div_index_summary.find('span', {'class' : 'time_rtq_content'}).find_all('span')[0].find('img')['alt']
            if index_current_up_or_down == 'Down':
                index_current_up_or_down = '-'
            else:
                index_current_up_or_down = ''
                
            index_current_change = div_index_summary.find('span', {'class' : 'time_rtq_content'}).find_all('span')[0].find(text=True).strip()
            index_current_percentage = div_index_summary.find('span', {'class' : 'time_rtq_content'}).find_all('span')[1].find(text=True).strip()
            index_current_percentage = re.sub(r'\(|\)', '', index_current_percentage)
            index_current_change = index_current_up_or_down + index_current_change
            index_current_percentage = index_current_up_or_down + index_current_percentage
            summary['index_change'] = index_current_change
            summary['index_change_percentage'] = index_current_percentage
            
            # get time
            index_current_time = div_index_summary.find('span', {'class' : 'time_rtq'}).find_all('span')[1].find(text=True).strip()
            summary['time'] = index_current_time
            
            print summary.__str__()
            
            today = time.strftime('%Y-%m-%d')
            file_name = "{platform}_{current_date}.txt".format(platform = key ,current_date = today)
            file_dir = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/stock_market/main_indexes/{sub_dir}/'.format( sub_dir = key)
            file_path = "{file_dir}{file_name}".format( file_dir = file_dir, file_name = file_name )
            self.save_csv(file_path, json.dumps(summary))
        
    def save_csv(self, arg_file_path, arg_data):
        try:
            with open(arg_file_path, 'a') as f:
                f.write(arg_data + '\n')
                return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True
        
if __name__ == "__main__":
    bitcoin_handler = StockPriceHandler()
    bitcoin_handler.get_csv()