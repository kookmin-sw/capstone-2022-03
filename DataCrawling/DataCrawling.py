# 2022캡스톤디자인 팀3
# 크롤링 API
# made by 20163092 김상윤

import time
from datetime import datetime
from bs4 import BeautifulSoup
import requests as req
import re
from pymongo import MongoClient
import pymongo

""" 데이터 크롤링 part """
url = "https://opinion.lawmaking.go.kr/gcom/ogLmPp?"
html = req.get(url).text

soup = BeautifulSoup(html, 'html.parser')

is_progress = soup.select("div.cont_right > div > div > div > div.dbody > ul > li.title.W40 > span") #진행여부
bill_name = soup.select("div.cont_right > div > div > div > div.dbody > ul > li.title.W40 > a") #입법예고명

bill_kind = [] #법령종류
legi_div = [] #입법구분
remit = [] #소관부처
bill_num = [] #공고번호
start = [] #입법의견접수기간 시작일
due = [] #입법의전접수기간 마감일
url = [] #상세정보페이지url
bill_id = [] #각 법안에 대한 id값
data_list = [] #각 법안에 대한 데이터모음

temp = soup.select("div.cont_right > div > div > div > div.dbody > ul > li.W15 > p")
temp_2 = soup.select("div.cont_right > div > div > div > div.dbody > ul > li.W15.m-br.blue > p")
temp_3 = soup.select("div.cont_right > div > div > div > div.dbody > ul > li.W18.blue > p")

""" Data Trimming """
for e in range(len(is_progress)) :
    is_progress[e] = is_progress[e].text
    is_progress[e] = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]','', is_progress[e])
    if is_progress[e] != "진행" :
        is_progress[e] = "종료"

for b in range(len(bill_name)) :
    href = bill_name[b].attrs['href']
    id_code = href[-5:]
    bill_id.append(id_code)
    href = "https://opinion.lawmaking.go.kr" + href
    url.append(href)
    bill_name[b] = bill_name[b].text.strip()

for k in range(0,len(temp_2),2) :
    temp_2[k] = temp_2[k].text
    temp_2[k+1] = temp_2[k+1].text
    temp_2[k+1] = temp_2[k+1][1:][:len(temp_2[k+1])-2]
    bill_kind.append(temp_2[k])
    legi_div.append(temp_2[k+1])

for j in range(0, len(temp_3), 2) :
    temp_3[j] = temp_3[j].text
    temp_3[j+1] = temp_3[j+1].text
    temp_3[j+1] = temp_3[j+1][1:][:len(temp_3[j+1])-2]
    remit.append(temp_3[j])
    bill_num.append(temp_3[j+1])

for i in range(2,len(temp),4) : #입법의견접수기간 append 코드
    temp[i] = temp[i].text
    temp[i+1] = temp[i+1].text
    start.append(temp[i])
    due.append(temp[i+1])

""" dictionary로 merge part"""
for i in range(0, len(bill_name)) :
    data = {
        "진행여부" : is_progress[i] ,
        "입법예고명" : bill_name[i] ,
        "법령종류" : bill_kind[i] ,
        "입법구분" : legi_div[i] ,
        "소관부처" : remit[i] ,
        "공고번호" : bill_num[i] ,
        "의견접수시작일" : start[i] ,
        "의견접수마감일" : due[i] ,
        "상세정보페이지url" : url[i] ,
        "법안id" : bill_id[i]
    }
    data_list.append(data)

""" DB연동 part """
connection = MongoClient(host='localhost', port=27017)

mongodb = connection.capstone
bill_collection = mongodb.bill_data

""" DB데이터삽입 """
for d in range(0, len(data_list)) :
    bill_collection.insert_one(data_list[d])

""" debug """
# print(is_progress)
# print(bill_name)
# print(bill_kind)
# print(legi_div)
# print(remit)
# print(bill_num)
# print(due)
# print(url)
# print(bill_id)
# print(data_list)