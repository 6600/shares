#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import os
import json
import requests
import time


# 今天日期
date = time.strftime('%Y.%m.%d',time.localtime(time.time()))

# 判断是否已经获取到了当天的数据
if not os.path.exists('./history/' + date + '.json'):
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
        "todayStartPri": float(szArr[1]),    # 今日开盘价
        "yestodEndPri": float(szArr[2]),     # 昨日收盘价
        "nowPri": float(szArr[3]),     # 当前价格
        "todayMax": float(szArr[4]),     # 今日最高价
        "todayMin": float(szArr[5]),     # 今日最低价
        "competitivePri": float(szArr[6]),     # 竞买价
        "reservePri": float(szArr[7]),     # 竞卖价
        "traNumber": float(szArr[8]),     # 成交的股票数
        "traAmount": float(szArr[9]),     # 成交金额
        "buyOne": float(szArr[10]),     # 买一数量
        "buyOnePri": float(szArr[11]),     # 买一报价
        "buyTwo": float(szArr[12]),     # 买二数量
        "buyTwoPri": float(szArr[13]),     # 买二报价
        "buyThree": float(szArr[14]),     # 买三数量
        "buyThreePri": float(szArr[15]),     # 买三报价
        "buyFour": float(szArr[16]),     # 买四数量
        "buyFourPri": float(szArr[17]),     # 买四报价
        "buyFive": float(szArr[18]),     # 买五数量
        "buyFivePri": float(szArr[19]),     # 买五报价
        "sellOne": float(szArr[20]),     # 卖一数量
        "sellOnePri": float(szArr[21]),     # 卖一报价
        "sellTwo": float(szArr[22]),     # 卖二数量
        "sellTwoPri": float(szArr[23]),     # 卖二报价
        "sellThree": float(szArr[24]),     # 卖三数量
        "sellThreePri": float(szArr[25]),     # 卖三报价
        "sellFour": float(szArr[26]),     # 卖四数量
        "sellFourPri": float(szArr[27]),     # 卖四报价
        "sellFive": float(szArr[28]),     # 卖五数量
        "sellFivePri": float(szArr[29]),     # 卖五报价
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

  file_path = './history/' + date + '.json'
  with open(file_path, mode='w', encoding='utf-8') as file_obj:
    file_obj.write(json.dumps(summary))

# 跌了的列表
lostList = []
# 涨了的列表
winList = []
# 没有涨没有跌的
flatList = []
# 总交易价格
allTraAmount = 0
# 读取上证数据
todayData = json.loads(open('./history/' + date + '.json', 'r', encoding='utf-8').read())

for player in todayData:
  # 消费 = 收盘值 - 开盘值
  consumption = player['nowPri'] - player['todayStartPri']
  if consumption > 0:
    winList.append(player)
  elif consumption == 0:
    print(player)
    flatList.append(player)
  else:
    lostList.append(player)
  # 增加价格
  allTraAmount += player['traAmount']

print('今日: [%s] 只股票赢了 [%s] 只股票输了 [%s] 只股票在观望!' % (str(len(winList)), str(len(lostList)), str(len(flatList))))
print('成交金额 [%s], 平均成交金额 [%s]' % (str(allTraAmount), str(allTraAmount / len(todayData))))