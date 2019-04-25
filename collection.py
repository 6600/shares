#!/usr/bin/python
# -*- coding: UTF-8 -*- 

import re
import os
import json
import requests
import time
import schedule
import zipfile
import shutil
from handle import Handle

from sdk import Weixin

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


# 控制程序是否持续运行
keepRun = False
# 数据存储字段
summary = ''
# 数据生成时间
timeData = ''

szListFile = open('sz.json', 'r', encoding='utf-8').read()
szList = json.loads(szListFile)

config = json.load(open("config.json", encoding='utf-8'))
weixin = Weixin(corpid=config['weixin']['corpid'], corpsecret=config['weixin']['corpsecret'])


# 存储数据
def run():
  
  global szList
  global keepRun
  while keepRun:
    global summary
    global timeData
    summary = '股票名字,代码,当前价格,昨日收盘价,今日开盘价,成交的股票数,外盘,内盘,买一报价,买一数量,买二报价,买二数量,买三报价,买三数量,买四报价,买四数量,买五报价,买五数量,卖一报价,卖一数量,卖二报价,卖二数量,卖三报价,卖三数量,卖四报价,卖四数量,卖五报价,卖五数量,最近逐笔成交,时间,涨跌,涨跌%,今日最高价,今日最低价,价格/成交量(手)/成交额,成交量(手),成交金额,换手率(%),市盈率,最高,最低,振幅(%),流通市值(亿),总市值(亿),市净率,涨停价,跌停价,量比,委差,平均成本,PE(动)\n'
    # 每200个提交一次
    tempList = []
    timeData = ''
    def getData ():
      listString = ','.join(tempList)
      data = requests.get(url='http://qt.gtimg.cn/q=' + listString).text
      sharesList = re.findall(r"=\"1\~(.+?)\";", data)
      
      # 去掉空数据
      for sz in sharesList:
        global summary
        global timeData
        if (timeData == ''):
          timeData = sz.split('~')[29]
        
        summary += sz.replace("~",",") + '\n'

    for sz in szList:
      if len(tempList) >= 200:
        getData()
        tempList = []
      tempList.append(sz['id'])
    # 处理尾巴
    getData()
    file_path = './history/temp/' + timeData + '.csv'
    with open(file_path, mode='w', encoding='utf_8_sig') as file_obj:
      file_obj.write(summary)
    
    # 每5秒执行一次
    schedule.run_pending()
    time.sleep(5)

# 开始运行程序
def start():
  global keepRun
  # 创建文件夹
  mkdir('./history/temp')
  if (not keepRun):
    print('开始运行')
    keepRun = True
    run()

# 停止程序
def stop():
  global keepRun
  if (keepRun):
    print('停止运行')
    keepRun = False

def pack():
  print('开始压缩')
  startdir = "./history/temp"  #要压缩的文件夹路径
  file_news ='./history/' + time.strftime('%Y.%m.%d',time.localtime(time.time())) +'.zip' # 压缩后文件夹的名字
  z = zipfile.ZipFile(file_news,'w',zipfile.ZIP_DEFLATED) #参数一：文件夹名
  for dirpath, dirnames, filenames in os.walk(startdir):
      fpath = dirpath.replace(startdir,'') #这一句很重要，不replace的话，就从根目录开始复制
      fpath = fpath and fpath + os.sep or ''#这句话理解我也点郁闷，实现当前文件夹以及包含的所有文件的压缩
      for filename in filenames:
          z.write(os.path.join(dirpath, filename),fpath+filename)
  z.close()
  time.sleep(5)
  shutil.rmtree(startdir)
  print('压缩成功')

def sendMessage():
  weixin.getToken()
  sbData = Handle.SB()
  print(weixin.sendMessage({
    "touser" : "@all",
    "msgtype" : "text",
    "agentid" : 1000004,
    "text" : {
      "content" : '购买意愿: ' + str(round(sbData['buy'] / sbData['sell'], 2))
    },
    "safe":0
  }))

# 指定时间运行
schedule.every().day.at("09:25").do(start)
schedule.every().day.at("11:35").do(stop)
schedule.every().day.at("13:25").do(start)
schedule.every().day.at("15:35").do(stop)
# 每天4点压缩数据
schedule.every().day.at("16:00").do(pack)

# 每天9点40发送购买意愿
schedule.every().day.at("09:40").do(sendMessage)

# start()
# pack()

# 不断运行
while True:
  schedule.run_pending()
  time.sleep(1)