# -*- coding: utf-8 -*-
import urllib2, json, time

class BitcoinHandler():
    def __init__(self):
        self._coindesk_url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
        self._coinbase_url = 'https://api.coinbase.com/v1/currencies/exchange_rates'
        self._bitstamp_url = 'https://www.bitstamp.net/api/ticker/'
        self._btc_e_url = 'https://btc-e.com/api/2/btc_usd/ticker' # issue
        self._itbit_url = 'https://api.itbit.com/v1/markets/XBTUSD/ticker'
        self._lakebtc_url = 'https://www.lakebtc.com/api_v1/ticker'
        self._okcoin_url = 'https://www.okcoin.com/api/v1/ticker.do?symbol=btc_usd'
        self._bitfinex_url = 'https://api.bitfinex.com/v1/ticker/btcusd'
        # chinese platforms
        self._bityes_url = 'https://market.bityes.com/usd_btc/ticker.js'
        self._btc_q_url = 'https://www.btc-q.com/futuresApi/ticker.do'
        
    def get_coinbase_exchange_rate(self):
        resp = urllib2.urlopen(self._coinbase_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['btc_to_usd']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "coinbase_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/coinbase/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def get_coindesk_exchange_rate(self):
        resp = urllib2.urlopen(self._coindesk_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['bpi']['USD']['rate']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "coindesk_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/coindesk/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def get_bitstamp_exchange_rate(self):
        resp = urllib2.urlopen(self._bitstamp_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['last']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "bitstamp_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/bitstamp/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def get_btc_e_exchange_rate(self):
        resp = urllib2.urlopen(self._btc_e_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['ticker']['avg']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "btc_e_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/btc_e/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    # itbit
    def get_itbit_exchange_rate(self):
        resp = urllib2.urlopen(self._itbit_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['lastPrice']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "itbit_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/itbit/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    # lakebtc
    def get_lakebtc_exchange_rate(self):
        resp = urllib2.urlopen(self._lakebtc_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['USD']['last']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "lakebtc_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/lakebtc/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    # okcoin
    def get_okcoin_exchange_rate(self):
        resp = urllib2.urlopen(self._okcoin_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['ticker']['last']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "okcoin_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/okcoin/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content    
        
    def get_bitfinex_exchange_rate(self):
        resp = urllib2.urlopen(self._bitfinex_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['last_price']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "bitfinex_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/bitfinex/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def get_bityes_exchange_rate(self):
        resp = urllib2.urlopen(self._bityes_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['ticker']['last']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "bityes_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/bityes/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def get_btc_q_exchange_rate(self):
        resp = urllib2.urlopen(self._btc_q_url)
        content = json.loads( resp.read() )
        rate = '{0:.2f}'.format(float(content['ticker'][0]['last']))
        current_time = time.strftime('%Y-%m-%d %H:%M:%S')
        rate_info = { 'current_time' : current_time, 'rate' : rate}
        resp.close()

        today = time.strftime('%Y-%m-%d')
        file_name = "btc_q_exchange_rate_{current_date}.txt".format(current_date = today)
        file_path = "{path}{file_name}".format(path = '/var/www/prjTheEdge-Beta-1.0/media/static/frontend/files/bitcoin/btc_q/', file_name = file_name)
        self.save_data(file_path, json.dumps(rate_info))
        return content
        
    def save_data(self, arg_file_path, arg_data):
        try:
            with open(arg_file_path, 'a') as f:
                f.write(arg_data + '\n')
                return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True
        
if __name__ == "__main__":
    bitcoin_handler = BitcoinHandler()
    bitcoin_handler.get_coindesk_exchange_rate()
    bitcoin_handler.get_coinbase_exchange_rate()
    bitcoin_handler.get_bitstamp_exchange_rate()
    bitcoin_handler.get_itbit_exchange_rate()
    bitcoin_handler.get_lakebtc_exchange_rate()
    bitcoin_handler.get_okcoin_exchange_rate()
    bitcoin_handler.get_bitfinex_exchange_rate()
    bitcoin_handler.get_btc_q_exchange_rate()
    # bitcoin_handler.get_btc_e_exchange_rate()
    # bitcoin_handler.get_bityes_exchange_rate()
    