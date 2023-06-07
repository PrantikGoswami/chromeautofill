#!/usr/bin/env python
# coding: utf-8

# In[1]:


from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import TCPServer
import pandas as pd
import urllib
import re
import json
from json.decoder import JSONDecoder
from urllib.parse import urlparse, parse_qs

class S(SimpleHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        return
        
    def do_POST(self):
        self._set_headers()
        #print ("in post method")
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        message = json.loads(self.data_string)
        print (message)
        experimenter = message.pop('experimenter')
        my_list = []
        my_list.append(message)
        export_df = pd.DataFrame(my_list)
        try:
            pd.read_csv('log/'+experimenter+'.csv')
            export_df.to_csv('log/'+experimenter+'.csv', mode='a', header=False, index=False)
        except FileNotFoundError:
            export_df.to_csv('log/'+experimenter+'.csv', mode='w', header=True, index=False)
        return 
        
def run(server_class=HTTPServer, handler_class=S, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print ('Starting server at localhost 8080 port...')
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()

