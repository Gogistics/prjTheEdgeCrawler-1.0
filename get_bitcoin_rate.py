# -*- coding: utf-8 -*-
import urllib2, json

class BitcoinHandler():
    def __init__(self):
        self._coindesk_url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
        self._coinbase_url = 'https://api.coinbase.com/v1/currencies/exchange_rates'
        self._bitstamp_url = 'https://www.bitstamp.net/api/ticker/'
        self._btc_e_url = 'https://www.bitstamp.net/api/ticker/'
        
    def get_coinbase_exchange_rate(self):
        resp = urllib2.urlopen(self._coinbase_url)
        content = json.loads( resp.read() )
        print content
        return content
        
    def get_coindesk_exchange_rate(self):
        resp = urllib2.urlopen(self._coindesk_url)
        content = json.loads( resp.read() )
        print content
        return content
        
    def get_bitstamp_exchange_rate(self):
        resp = urllib2.urlopen(self._bitstamp_url)
        content = json.loads( resp.read() )
        print content
        return content
        
    def get_btc_e_exchange_rate(self):
        resp = urllib2.urlopen(self._btc_e_url)
        content = json.loads( resp.read() )
        print content
        return content
        
if __name__ == "__main__":
    bitcoin_handler = BitcoinHandler()
    bitcoin_handler.get_btc_e_exchange_rate()
    bitcoin_handler.get_coindesk_exchange_rate()
    bitcoin_handler.get_coinbase_exchange_rate()
    bitcoin_handler.get_bitstamp_exchange_rate()