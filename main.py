
import json

# 读取上证指数列表
SHList = open('SH.json', 'r', encoding='utf-8').read()
print(json.loads(SHList))