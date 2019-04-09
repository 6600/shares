#!/usr/bin/python
# -*- coding: UTF-8 -*- 
import re
import json
import requests

dataList = {}

# # 读取上证指数列表
# szListFile = open('sz.json', 'r', encoding='utf-8').read()
# szList = json.loads(szListFile)



# for sz in szList:
#   r = requests.get(url='http://quote.eastmoney.com/' + sz['id'] +'.html')
#   r.encoding='gb2312'
#   data = r.text
#   # 取中间
#   plate = re.findall(r"a039\">(.+?)<", data)[0]
#   print(plate)
#   dataList[sz['id']] = plate

# print(dataList)

# 读取上证指数列表
plateListFile = open('plate.json', 'r', encoding='utf-8').read()
plateList = json.loads(plateListFile)



for sz in plateList:
  dataList[plateList[sz]] = []

for sz in plateList:
  dataList[plateList[sz]].append(sz)

print(dataList)