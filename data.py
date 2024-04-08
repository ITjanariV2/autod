from urllib.request import urlopen, Request
import json
from bs4 import BeautifulSoup
import re

arrayToJson = []
amount = 0
page = 0
array = []

def scrape(page):
    allImages = []
    allCars = []
    url = f'https://www.auto24.ee/kasutatud/nimekiri.php?bn=2&a=100&ssid=132862534&j[0]=1&j[1]=2&j[2]=3&j[3]=4&j[4]=5&j[5]=6&j[6]=61&j[7]=67&j[8]=7&j[9]=8&j[10]=69&j[11]=70&j[12]=9&j[13]=17&j[14]=66&j[15]=26&j[16]=59&j[17]=27&j[18]=25&j[19]=60&j[20]=55&j[21]=56&j[22]=63&j[23]=68&j[24]=28&j[25]=62&j[26]=64&j[27]=33&j[28]=32&j[29]=31&j[30]=58&j[31]=43&j[32]=44&f1=1930&f2=2024&g1=50&g2=999999999999999999999999999&l1=2&l2=999999999999999999999999999999999999999999&h[0]=1&h[1]=2&h[2]=3&h[3]=10&h[4]=12&h[5]=13&h[6]=4&h[7]=9&h[8]=11&h[9]=5&h[10]=14&h[11]=15&h[12]=16&h[13]=17&h[14]=6&h[15]=7&h[16]=8&i[0]=1&i[1]=2&i[2]=3&p[0]=1&p[1]=2&p[2]=3&ae=3&af=50&otsi=otsi&ak={page}'

    headers = {
        'Cookie': 'CID=1710091905977600; OptanonAlertBoxClosed=2024-03-10T17:31:55.392Z; eupubconsent-v2=CP7QJbAP7QJbAAcABBENArEgAAAAAAAAAChQAAAAAAIBIFYACAAFgAVAA4AB4AEAAL4AZABqADwAIgATAAqgBvAD8AISARABEgCOAEsAJoAYAAwwBlgDZAHxAPsA_YB_gIBARcBGACNQEiASUAn4BUAC5gGKANoAbiBHoEiAJ2AUOApEBbAC5AF3gLzCADwAHAAZABIAG0Ag4BHAC-gJLASsAmUBSAClwFiALyCDUGADgAqABfAHcAeACAAEYASWAuQQAKABUAC8AO4BAACMAGoAR2AksBboC5BQAIAFQAeBgAEAFQ4A4AAiABwAHgAXAAyACQAH4AUAA0ABtAEcAOQAgABBwCIgEcAKgAdIBJYCVgExAJlAUmAqoBYgC6AGBAMECDUOgXgALAAqABwAEAAL4AYgBqADwAIgATAAqwBcAF0AMQAbwA_QCIAIkASwAmgBgADDAGzAPsA_QB_wEWARiAjoCSgE_ALmAXkAxQBtADcAH2ARfAj0CRAEyAJ2AUOApABYoC2AFugLkAXaAu8BeYC-gJvAThIADAAEAAPAAyAGgAcgBHAC-gKTAWIAvIBgQDBCEBIABYAMQAagBMACqAFwAMQAbwBHADAAH-AXMAxQBtAEegLFAWiAuQlAYAAQAAsADgAMQAeABEACYAFUALgAYoBEAESAI4AYAA2QB-AFzAMUAiYBF8CPQJEAWKAtgBeYE4SQA0AC4AGQAagB4AIAAQcAjgBUADtgJWATEApMBgRQAsAAoAC4AGQASABtADwAI4AcgA-wCAAEHANeAdsA_4CSwExAKkAXQAvIBgQDBAJwlIEoACwAKgAcABBADEANQAeABEACYAFUAMQAfoBEAESAMAAbMA_AD9AIsARiAjoCSgFzALyAYoA2gBuAD7AImARfAj0CRAE7AKHAUgAsUBbAC5AF2gLzAX0BN4tAEABqAI4AYAB9iwAQAZYBHAEegJiA.YAAAAAAAAAAA; my_searches_notif=1; PHPSESSID=5fa3738b1311bffc4f070f6adc89009c; __cf_bm=X7dKjFoIqLARQiPgwBcXGCPeCEW9UHdBoVYFcGR.MeE-1711215199-1.0.1.1-l1fb4oyHt02f_v6PO0x_IJZ8QhgsFMJcNiCq_7soEcew3c97zaNmNfMe3FHg0OLf.fIkNDj0QdgMSuEcNt4X6Q; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Mar+23+2024+19%3A33%3A20+GMT%2B0200+(Ida-Euroopa+standardaeg)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=3649ccb1-bcc9-4f07-a06e-2a5fc9965c81&interactionCount=1&landingPath=NotLandingPage&groups=C0003%3A0%2CC0001%3A1%2CC0004%3A0%2CC0002%3A0%2CV2STACK42%3A0&geolocation=%3B&AwaitingReconsent=false',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    req = Request(url, headers=headers)
    response = urlopen(req)
    soup = BeautifulSoup(response, features='html.parser')

    mainContent = soup.find('div', attrs = {'id': 'usedVehiclesSearchResult-flex'})

    img = mainContent.find_all('span', attrs = {'class', 'thumb'})

    content = mainContent.find_all('div', attrs = {'class', 'description'})

    for x in content:
        description = x.find_all('span')
        arr = [span.text.strip() for span in description if 'model-short' not in span.get('class', []) and 'transmission_short_icon' not in span.get('class', [])]

        filtered_array = [s.replace('\xa0', ' ') for s in arr if "€" not in s] # remove /xa0 and removes euro shit

        filtered_array.pop(4)
        filtered_array.pop(4)
        filtered_array.pop(6)

        if 'B' in filtered_array:
            filtered_array.remove('B')

        joinedBrand = ' '.join(filtered_array[:3])
        filtered_array = filtered_array[3:]
        filtered_array.insert(0, joinedBrand)

        filtered_array[2] = filtered_array[2].replace('km', '')
        filtered_array[2] = filtered_array[2].replace(' ', '') # remove spaces
        allCars.append(filtered_array)
    
    for image in img:
        el = image.get('style')
        imgSource = re.search(r"url\(['\"]?([^'\")]+)['\"]?\)", el).group(1)
        imgSource = list(imgSource)
        imgSource = ''.join(imgSource)
        allImages.append(imgSource)

    for i in range(len(allCars) - 1, -1, -1):
        if len(allCars[i]) != 7 or 'B' in allCars[i] or 'D' in allCars[i]:
            allImages.pop(i)
            allCars.pop(i)
            
    for i1, i2 in zip(allCars, allImages):
        
        obj = {
            'title': i1[0:1],
            'description': i1[1:],
            'image': i2
        }
        arrayToJson.append(obj)
    
while amount < 444: # 444
    scrape(page)
    page += 50
    amount += 1
    if amount % 10 == 0:
        print(amount)
    if page == 22100:
        break

with open('correctDB.json', 'w') as file:
    json.dump(arrayToJson, file)