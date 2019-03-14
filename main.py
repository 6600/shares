#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import json
import requests
# 读取上证指数列表
szListFile = open('sz.json', 'r', encoding='utf-8').read()
szList = json.loads(szListFile)

summary = []
# 每50个提交一次
tempList = []


def getData ():
  listString = ','.join(tempList)
  data = requests.get(url='http://hq.sinajs.cn/list=' + listString).text
  sharesList = re.findall(r"=\"(.+?)\";", data)
  
  for sz in sharesList:
    szArr = sz.split(',')
    summary.append({
      "name": szArr[0],     # 股票名字
      "todayStartPri": szArr[1],    # 今日开盘价
      "yestodEndPri": szArr[2],     # 昨日收盘价
      "nowPri": szArr[3],     # 当前价格
      "todayMax": szArr[4],     # 今日最高价
      "todayMin": szArr[5],     # 今日最低价
      "competitivePri": szArr[6],     # 竞买价
      "reservePri": szArr[7],     # 竞卖价
      "traNumber": szArr[8],     # 成交的股票数
      "traAmount": szArr[9],     # 成交金额
      "buyOne": szArr[10],     # 买一数量
      "buyOnePri": szArr[11],     # 买一报价
      "buyTwo": szArr[12],     # 买二数量
      "buyTwoPri": szArr[13],     # 买二报价
      "buyThree": szArr[14],     # 买三数量
      "buyThreePri": szArr[15],     # 买三报价
      "buyFour": szArr[16],     # 买四数量
      "buyFourPri": szArr[17],     # 买四报价
      "buyFive": szArr[18],     # 买五数量
      "buyFivePri": szArr[19],     # 买五报价
      "sellOne": szArr[20],     # 卖一数量
      "sellOnePri": szArr[21],     # 卖一报价
      "sellTwo": szArr[22],     # 卖二数量
      "sellTwoPri": szArr[23],     # 卖二报价
      "sellThree": szArr[24],     # 卖三数量
      "sellThreePri": szArr[25],     # 卖三报价
      "sellFour": szArr[26],     # 卖四数量
      "sellFourPri": szArr[27],     # 卖四报价
      "sellFive": szArr[28],     # 卖五数量
      "sellFivePri": szArr[29],     # 卖五报价
      "date": szArr[30],     # 日期
      "time": szArr[31],     # 时间
    })

for sz in szList:
  if len(tempList) >= 50:
    getData()
    tempList = []
  else:
    tempList.append('sh' + sz['id'])

getData()

file_path = './history/' + summary[0]['date'] + '.json'
with open(file_path, mode='w', encoding='utf-8') as file_obj:
  file_obj.write(json.dumps(summary))
