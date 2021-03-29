import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

from bs4 import BeautifulSoup
from bs4 import Comment

import json
import tabula
import pandas as pd

import re
import os



def requests_retry_session(retries=3, backoff_factor=0.3, status_forcelist=(500, 502, 504), session=None,):
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session


def get_page(url):
    headers = {"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit 537.36 (KHTML, like Gecko) Chrome","Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"}
    response = requests_retry_session().get(url, headers=headers, timeout=10)
    return response


def convert_income_table(income_type, df, drop_0_index, columns, non_numerical_range, numerical_range):
    salary_ranges = {
        'no salary': {'min': 0.0, 'max': 0.0},
        '1 - 499 EUR': {'min': 1.0, 'max': 499.0},
        '500 - 1000 EUR': {'min': 500.0, 'max': 1000.0},
        '1001 - 5000 EUR': {'min': 1001.0, 'max': 5000.0},
        '5001 - 10000 EUR': {'min': 5001.0, 'max': 10000.0}
    }
    columns_dict = {df.columns[idx]:x for idx, x in enumerate(columns)}

    df = df.rename(columns=columns_dict)
    if drop_0_index: df = df.drop(index=0)
    df[columns[0]] = df[columns[0]].apply(lambda x: str(x).split(".")[1].replace("\r", " ").strip())
    for icol in non_numerical_range:
        df[df.columns[icol]] = df[df.columns[icol]].apply(lambda x: 1.0 if str(x).strip().upper()=="X" else 0.0)
    for icol in numerical_range:
        df[df.columns[icol]] = df[df.columns[icol]].fillna(0)
    df = df[(df[columns[0]]!='') & (df[columns[0]]!=0) & (df[columns[0]]!='0')]

    incomes = []
    for row in df.values.tolist():
        try:
            salary_position = row.index(1)
            income_min = salary_ranges[columns[salary_position]]['min']
            income_max = salary_ranges[columns[salary_position]]['max']
        except:
            salary_position = -1
            income_min = row[salary_position]
            income_max = row[salary_position]
        incomes.append({'income_type': income_type, 'activity': row[0], 'income_min': income_min, 'income_max': income_max})
    return incomes


def get_MEPs_from_EUP(url):
    meps_data = []
    error_count = 0

    #get list of MEPs + basic metadata
    print("scraping main url", url)
    resp = get_page(url)
    soup = BeautifulSoup(resp.content, 'html.parser')
    resp.close()

    mep_containers = soup.findAll('div', attrs={'class':'erpl_member-list-item'})
    print("- found", len(mep_containers), "MEP profiles")

    for idx, mep_div in enumerate(mep_containers):
        mep_url = mep_div.find('a', attrs={'itemprop':'url'})['href']
        mep_name = mep_div.find('div', attrs={'class':'erpl_title-h5'}).text.strip()
        mep_eup_party = mep_div.findAll('div', attrs={'class':'sln-additional-info'})[0].text.strip()
        mep_country = mep_div.findAll('div', attrs={'class':'sln-additional-info'})[1].text.strip()
        mep_local_party = mep_div.findAll('div', attrs={'class':'sln-additional-info'})[2].text.strip()

        mep_photo_url = None
        comments = mep_div.find_all(string=lambda text: isinstance(text, Comment))
        for c in comments:
            if "Photo URL" in c:
                mep_photo_url = c.split(" : ")[1].strip()


        #get individual mep details
        print("--- scraping", mep_name, "-", mep_country, "@", mep_url)
        resp = get_page(mep_url)
        soup = BeautifulSoup(resp.content, 'html.parser')
        resp.close()

        mep_header = soup.find('section', attrs={'id':'presentationmep'})

        mep_twitter_url = None
        if mep_header.find('i', attrs={'class':'erpl_icon-twitter-dark'}): mep_twitter_url = mep_header.find('i', attrs={'class':'erpl_icon-twitter-dark'}).parent['href']

        mep_facebook_url = None
        if mep_header.find('i', attrs={'class':'erpl_icon-facebook-dark'}): mep_facebook_url = mep_header.find('i', attrs={'class':'erpl_icon-facebook-dark'}).parent['href']

        mep_birthday = None
        if mep_header.find('time', attrs={'class':'sln-birth-date'}): mep_birthday = mep_header.find('time', attrs={'class':'sln-birth-date'}).text.strip()

        mep_birthplace = None
        if mep_header.find('span', attrs={'class':'sln-birth-place'}): mep_birthplace = mep_header.find('span', attrs={'class':'sln-birth-place'}).text.strip()

        mep_declaration_main_url = "/".join(mep_url.split("/")[:3]) + soup.find('span', text=re.compile('Declarations')).parent['href']


        #get mep incom declarations
        resp = get_page(mep_declaration_main_url)
        soup = BeautifulSoup(resp.content, 'html.parser')
        resp.close()

        mep_declarations = [x for x in soup.findAll('a', attrs={'title':'Read the document'}, href=True) if 'DFI_LEG9' in x['href']]
        mep_declarations_dates = [x.text.strip().split(" - ")[1].strip().split("(")[0].strip() for x in mep_declarations]
        mep_declarations_urls = [x['href'] for x in mep_declarations]

        latest_mep_declaration_url = mep_declarations_urls[-1]
        latest_mep_declaration_date = mep_declarations_dates[-1]

        #get and convert income tables
        columns_type1 = ['activity', 'no salary', '1 - 499 EUR', '500 - 1000 EUR', '1001 - 5000 EUR', '5001 - 10000 EUR', '> 10000 EUR']
        columns_type2 = ['activity', '1 - 499 EUR', '500 - 1000 EUR', '1001 - 5000 EUR', '5001 - 10000 EUR', '> 10000 EUR']
        columns_type3 = ['mandate', 'amount']

        tables = tabula.read_pdf(latest_mep_declaration_url, pages='all', lattice=True, guess=False, stream=True)

        #it would not work for the tables which are overlapped through 2 or more pages hence dealing with not the most perfect way...
        incomes = []
        try:
            incomes += convert_income_table('previous_occupations', tables[0], True, columns_type1, [1,2,3,4,5], [6])
            incomes += convert_income_table('other_mandates', tables[1], False, columns_type3, [], [1])
            incomes += convert_income_table('remunerated_activities', tables[2], True, columns_type2, [1,2,3,4], [5])
            incomes += convert_income_table('remunerated_memberships', tables[3], True, columns_type1, [1,2,3,4,5], [6])
            incomes += convert_income_table('occasional_activities', tables[4], True, columns_type2, [1,2,3,4], [5])
            incomes += convert_income_table('holdings_partnerships', tables[5], True, columns_type1, [1,2,3,4,5], [6])
        except:
            error_count += 1

        meps_data.append({
            'mep_name': mep_name,
            'mep_url': mep_url,
            'mep_photo_url': mep_photo_url,
            'mep_country': mep_country,
            'mep_eup_party': mep_eup_party,
            'mep_local_party': mep_local_party,
            'latest_mep_declaration_url': latest_mep_declaration_url,
            'latest_mep_declaration_date': latest_mep_declaration_date,
            'extra_income': incomes
        })
    print("- scraping completed, errors:", error_count)
    return meps_data


if __name__ == "__main__":
    url = "https://www.europarl.europa.eu/meps/en/full-list/all"
    meps_data = get_MEPs_from_EUP(url)
    with open(os.path.dirname(os.path.realpath(__file__)) + '/meps_data.json', 'w', encoding='utf8') as f:
        json.dump(meps_data, f, ensure_ascii=False)
