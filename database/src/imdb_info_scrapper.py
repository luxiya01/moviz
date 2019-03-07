import json
import re
import requests
import sys
from bs4 import BeautifulSoup
from collections import defaultdict


class IMDBInfoScrapper:
    def __init__(self, movie_list_file, output_file):
        self.movie_dict = self._create_movie_dict(movie_list_file)
        self.output_file = output_file
        self._write_json()

    def _get_imdb_search_url(self, name):
        return 'https://www.imdb.com/find?q=%s&s=tt&exact=true&ref_=fn_tt_ex' % (
            name)

    def _get_imdb_movie_url(self, link):
        return 'https://www.imdb.com%s' % link

    def _generate_error_msg(self, attr, imdb_title, err):
        return ('Error occurred when scraping %s for movie %s in IMDB: \n %s' %
                (attr, imdb_title, err))

    def _create_movie_dict(self, movie_list_file):
        movie_dict = self._parse_movie_list_file(movie_list_file)
        movie_dict = self._get_imdb_links(movie_dict)
        movie_dict = self._get_detailed_movie_info(movie_dict)
        return movie_dict

    def _parse_movie_list_file(self, movie_list_file):
        movie_dict = defaultdict(dict)
        with open(movie_list_file, 'r') as f:
            for line in f:
                line = line.split('-----')
                boxoffice_id = line[0]
                title = line[1].strip()
                current_movie_dict = dict()
                current_movie_dict['id'] = boxoffice_id
                current_movie_dict['title'] = title
                current_movie_dict['imdb_title'] = self._parse_movie_name(
                    title)
                movie_dict[boxoffice_id] = current_movie_dict
        return movie_dict

    def _parse_movie_name(self, name):
        # Return original name if it doesn't contain ()
        if not re.search(r'\(', name):
            return name.strip()
        # Return original name if it contains (number)
        if re.search(r'\(\d+\)', name):
            return name.strip()
        # Otherwise, the original name is of the form: string (number string)
        # In such case, remove the entire parentheses
        return name.split('(')[0].strip()

    def _get_imdb_links(self, movie_dict):
        for boxoffice_id, current_movie_dict in movie_dict.items():
            url = self._get_imdb_search_url(current_movie_dict['imdb_title'])
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                link = soup.select('.result_text')[0].a['href']
                current_movie_dict['link'] = '/'.join(link.split('/')[:-1])
            except Exception as err:
                print(
                    self._generate_error_msg(
                        'IMDB link', current_movie_dict['imdb_title'], err))
        return movie_dict

    def _get_detailed_movie_info(self, movie_dict):
        for boxoffice_id, current_movie_dict in movie_dict.items():
            soup = None
            try:
                url = self._get_imdb_movie_url(current_movie_dict['link'])
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
            except Exception as err:
                print(
                    self._generate_error_msg(
                        'IMDB detail', current_movie_dict['imdb_title'], err))
            if soup:
                self._scrap_img(soup, current_movie_dict)
                self._scrap_rating_info(soup, current_movie_dict)
                self._scrap_budget(soup, current_movie_dict)
                self._scrap_countries(soup, current_movie_dict)
                self._scrap_genres(soup, current_movie_dict)
                self._scrap_languages(soup, current_movie_dict)
                self._scrap_filming_locations(soup, current_movie_dict)
                self._scrap_companies(soup, current_movie_dict)
                self._scrap_release_date(soup, current_movie_dict)
        return movie_dict

    def _scrap_img(self, soup, current_movie_dict):
        try:
            poster = soup.select('.poster')
            img_src = poster[0].a.img['src']
            current_movie_dict['img'] = img_src
        except Exception as err:
            print(
                self._generate_error_msg(
                    'countries', current_movie_dict['imdb_title'], err))

    def _scrap_rating_info(self, soup, current_movie_dict):
        try:
            rating = soup.find('span', itemprop='ratingValue')
            current_movie_dict['rating'] = float(rating.text)
            rating_count = soup.find('span', itemprop='ratingCount')
            current_movie_dict['rating_counts'] = int(
                rating_count.text.replace(',', ''))
        except Exception as err:
            print(
                self._generate_error_msg(
                    'rating', current_movie_dict['imdb_title'], err))

    def _scrap_budget(self, soup, current_movie_dict):
        try:
            budget_text = soup.find('h4', text='Budget:').parent.text
            budget = int(
                budget_text.split('$')[1].split('\n')[0].replace(',', ''))
            current_movie_dict['budget'] = budget
        except Exception as err:
            print(
                self._generate_error_msg(
                    'budget', current_movie_dict['imdb_title'], err))

    def _scrap_release_date(self, soup, current_movie_dict):
        try:
            release_date = soup.find('h4', text='Release Date:').parent.text
            release_date = release_date.split(':')[1].split('\n')[0].strip()
            current_movie_dict['release_date'] = release_date
        except Exception as err:
            print(
                self._generate_error_msg(
                    'budget', current_movie_dict['imdb_title'], err))

    def _scrap_countries(self, soup, current_movie_dict):
        self._scrap_details(soup, current_movie_dict, 'country', 'Country:')

    def _scrap_genres(self, soup, current_movie_dict):
        self._scrap_details(soup, current_movie_dict, 'genre', 'Genres:')

    def _scrap_languages(self, soup, current_movie_dict):
        self._scrap_details(soup, current_movie_dict, 'language', 'Language:')

    def _scrap_filming_locations(self, soup, current_movie_dict):
        self._scrap_details(soup, current_movie_dict, 'filming_location',
                            'Filming Locations:')

    def _scrap_companies(self, soup, current_movie_dict):
        self._scrap_details(soup, current_movie_dict, 'company',
                            'Production Co:')

    def _scrap_details(self, soup, current_movie_dict, attr, text_to_find):
        try:
            lst = []
            parent = soup.find('h4', text=text_to_find).parent
            for a in parent.find_all('a'):
                text = a.text.strip()
                if text != 'See more':
                    lst.append(text)
            current_movie_dict[attr] = lst
        except Exception as err:
            print(
                self._generate_error_msg(
                    attr, current_movie_dict['imdb_title'], err))

    def _write_json(self):
        with open(self.output_file, 'w') as f:
            json.dump(self.movie_dict, f)


if __name__ == '__main__':
    IMDBInfoScrapper(sys.argv[1], 'imdb_movie_info.json')
