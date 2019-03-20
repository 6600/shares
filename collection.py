#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import os
import json
import requests
import time

from flask import Flask
from flask_cors import *

app = Flask(__name__)
CORS(app, supports_credentials=True)


# 如果不存在目录则创建目录
def mkdir(path):
  # 去除首位空格
  path = path.strip()
  # 去除尾部 \ 符号
  path = path.rstrip("\\")

  # 判断路径是否存在
  # 存在     True
  # 不存在   False
  isExists = os.path.exists(path)
  # 判断结果
  if not isExists:
    # 如果不存在则创建目录
    os.makedirs(path) 
    print(path + ' 创建成功')
    return True
  else:
    return False

# 今天日期
date = time.strftime('%Y.%m.%d',time.localtime(time.time()))

mkdir('./history/' + date)

szListFile = open('sz.json', 'r', encoding='utf-8').read()
szList = json.loads(szListFile)




while True:
  print('开始获取!')
  summary = '股票名字,代码,当前价格,昨日收盘价,今日开盘价,成交的股票数,外盘,内盘,买一报价,买一数量,买二报价,买二数量,买三报价,买三数量,买四报价,买四数量,买五报价,买五数量,卖一报价,卖一数量,卖二报价,卖二数量,卖三报价,卖三数量,卖四报价,卖四数量,卖五报价,卖五数量,最近逐笔成交,时间,涨跌,涨跌%,今日最高价,今日最低价,价格/成交量(手)/成交额,成交量(手),成交金额,换手率(%),市盈率,最高,最低,振幅(%),流通市值(亿),总市值(亿),市净率,涨停价,跌停价,量比,委差,平均成本,PE(动)\n'
  # 每50个提交一次
  tempList = []
  timeData = ''
  def getData ():
    listString = ','.join(tempList)
    data = requests.get(url='http://qt.gtimg.cn/q=' + listString).text
    sharesList = re.findall(r"=\"1\~(.+?)\";", data)
    
    # 去掉空数据
    for sz in sharesList:
      global summary
      sz = sz.replace("~~", "~")
      global timeData
      if (timeData == ''):
        timeData = sz.split('~')[29]
      
      summary += sz.replace("~",",") + '\n'

  for sz in szList:
    if len(tempList) >= 50:
      getData()
      tempList = []
    tempList.append(sz['id'])
  # 处理尾巴
  getData()
  file_path = './history/' + date + '/' + timeData + '.csv'
  with open(file_path, mode='w', encoding='utf_8_sig') as file_obj:
    file_obj.write(summary)
  print('5秒后重新获取!')
  # 每5秒执行一次
  time.sleep(5)