#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import os
import json
import requests
import time
import handle

from flask import Flask
from flask_cors import *

app = Flask(__name__, static_folder='public', static_url_path='/public')

CORS(app, supports_credentials=True)

@app.route("/show1")
def show1():
  data = handle.Handle.essential()
  return json.dumps({
    "err": 0,
    "data": [
      {"value": data[0], "name":'涨'},
      {"value": data[1], "name":'跌'},
      {"value": data[1], "name":'平'}
    ]
  })

# 获取分布情况
@app.route("/distribution")
def distribution():
  return json.dumps({
    "err": 0,
    "data": handle.Handle.risingAndFalling()
  })

# 获取分布情况
@app.route("/transactionAve")
def transactionAve():
  data = handle.Handle.transactionAve()
  return json.dumps({
    "err": 0,
    "data": [data["buyPrice"], data["buyNumber"], data["sellPrice"], data["sellNumber"]]
  })

# 获取市值 市净率
@app.route("/VPB")
def VPB():
  return json.dumps({
    "err": 0,
    "data": handle.Handle.VPB()
  })

# 获取内盘外盘信息 饼状图
@app.route("/SB")
def SB():
  data = handle.Handle.SB()
  return json.dumps({
    "err": 0,
    "data": [
      {"value": data["sell"], "name":'卖出'},
      {"value": data["buy"], "name":'买入'}
    ]
  })

# 获取五秒交易量
@app.route("/wmjyl")
def wmjyl():
  return json.dumps({
    "err": 0,
    "data": handle.Handle.wmjyl()
  })

if __name__ == '__main__':
  app.run(
    host='0.0.0.0',
    port= 8003
  )