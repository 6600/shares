#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import os
import json
import requests
import time

from flask import Flask
from flask_cors import *

app = Flask(__name__, static_folder='public', static_url_path='/public')

CORS(app, supports_credentials=True)

tempData = ''
tempTime = 0

def getData2 (summary, tempList):
  listString = ','.join(tempList)
  data = requests.get(url='http://qt.gtimg.cn/q=' + listString).text
  sharesList = re.findall(r"=\"1\~(.+?)\";", data)

  # 去掉空数据
  for sz in sharesList:
    sz = sz.replace("~~", "~")
    summary += sz.replace("~",",") + '\n'
  return summary


def getData ():
  global tempData
  global tempTime
  if (int(time.time()) - tempTime < 30):
    return tempData
  # 今天日期
  date = time.strftime('%Y.%m.%d',time.localtime(time.time()))

  # 读取上证指数列表
  szListFile = open('sz.json', 'r', encoding='utf-8').read()
  szList = json.loads(szListFile)
  print("等待获取条数:" + str(len(szList)))
  summary = '股票名字,代码,当前价格,昨日收盘价,今日开盘价,成交的股票数,外盘,内盘,买一报价,买一数量,买二报价,买二数量,买三报价,买三数量,买四报价,买四数量,买五报价,买五数量,卖一报价,卖一数量,卖二报价,卖二数量,卖三报价,卖三数量,卖四报价,卖四数量,卖五报价,卖五数量,最近逐笔成交,时间,涨跌,涨跌%,今日最高价,今日最低价,价格/成交量(手)/成交额,成交量(手),成交金额,换手率(%),市盈率,最高,最低,振幅(%),流通市值(亿),总市值(亿),市净率,涨停价,跌停价,量比,委差,平均成本,PE(动)\n'
  
  # 每50个提交一次
  tempList = []


  for sz in szList:
    if len(tempList) >= 50:
      summary = getData2(summary, tempList)
      tempList = []
    tempList.append(sz['id'])

  summary = getData2(summary, tempList)

  # 清洗数据
  secondFloor = []

  index = 0
  for temp in summary.split('\n'):
    # 过滤掉空数据 并且过滤掉表头
    if (temp != "" and index != 0):
      secondFloor.append(temp.split(','))
    index += 1
  
  tempData = secondFloor
  tempTime = int(time.time())
  return secondFloor


@app.route("/show1")
def show1():
  # 跌了的列表
  lostList = []
  # 涨了的列表
  winList = []
  # 没有涨没有跌的
  flatList = []
  for player in getData():
    win = float(player[30])
    if win > 0:
      winList.append(player)
    elif win == 0:
      flatList.append(player)
    else:
      lostList.append(player)
  return json.dumps({
    "err": 0,
    "data": [
      {"value": len(winList), "name":'涨'},
      {"value": len(lostList), "name":'跌'},
      {"value": len(flatList), "name":'平'}
    ]
  })

# 获取分布情况
@app.route("/distribution")
def distribution():
  distributionList = []
  ind = 0
  for player in getData():
    distributionList.append([ind, player[31], player[0]])
    ind += 1
  return json.dumps({
    "err": 0,
    "data": distributionList
  })

# 获取分布情况
@app.route("/transactionAve")
def transactionAve():
  secondFloor = getData()
  buyPrice = [0, 0, 0, 0, 0]
  buyNumber = [0, 0, 0, 0, 0]
  sellPrice = [0, 0, 0, 0, 0]
  sellNumber = [0, 0, 0, 0, 0]
  length = len(secondFloor)
  for player in secondFloor:
    if (float(player[8]) == 0):
      print(player[0] + '买卖数据为空，排除!')
      length -= 1
      continue
    buyPrice[0] += float(player[8])
    buyNumber[0] += float(player[9])
    buyPrice[1] += float(player[10])
    buyNumber[1] += float(player[11])
    buyPrice[2] += float(player[12])
    buyNumber[2] += float(player[13])
    buyPrice[3] += float(player[14])
    buyNumber[3] += float(player[15])
    buyPrice[4] += float(player[16])
    buyNumber[4] += float(player[17])

    sellPrice[0] += float(player[18])
    sellNumber[0] += float(player[19])
    sellPrice[1] += float(player[20])
    sellNumber[1] += float(player[21])
    sellPrice[2] += float(player[22])
    sellNumber[2] += float(player[23])
    sellPrice[3] += float(player[24])
    sellNumber[3] += float(player[25])
    sellPrice[4] += float(player[26])
    sellNumber[4] += float(player[27])
  # 求平均
  for index in range(len(buyPrice)):
    buyPrice[index] = round(buyPrice[index] / length, 2)
  for index in range(len(buyNumber)):
    buyNumber[index] = round(buyNumber[index] / length, 2)
  for index in range(len(sellPrice)):
    sellPrice[index] = round(sellPrice[index] / length, 2)
  for index in range(len(sellNumber)):
    sellNumber[index] = round(sellNumber[index] / length, 2)
  return json.dumps({
    "err": 0,
    "data": [buyPrice, buyNumber, sellPrice, sellNumber]
  })

# 获取市值 市净率
@app.route("/VPB")
def VPB():
  VPBList = []
  secondFloor = getData()
  for player in secondFloor:
    # 筛选出市净率低的
    PB = float(player[44])
    if (PB < 0.95 and PB > 0 and float(player[51]) > 0):
      # 内外盘
      buy = float(player[6])
      sell = float(player[7])
      if (sell > 0 and buy > 0):
        VPBList.append([1 / float(player[51]), PB, player[0], buy / sell * 1000 ])
  return json.dumps({
    "err": 0,
    "data": VPBList
  })

# 获取内盘外盘信息 饼状图
@app.route("/SB")
def SB():
  number = 0
  buyTotal = 0
  sellTotal = 0
  secondFloor = getData()
  for player in secondFloor:
    buy = float(player[6])
    sell = float(player[7])
    if (sell > 0 and buy > 0):
      buyTotal += buy
      sellTotal += sell
      number += 1
  return json.dumps({
    "err": 0,
    "data": [
      {"value": int(sellTotal / number), "name":'卖出'},
      {"value": int(buyTotal / number), "name":'买入'}
    ]
  })

if __name__ == '__main__':
  app.run(
    host='0.0.0.0',
    port= 8003
  )