import json
import requests
import sys
from bs4 import BeautifulSoup

TITLE_URL = lambda x: 'https://www.imdb.com/title/%s' % x.strip()


def get_img_for_one_movie(movie_id):
    url = TITLE_URL(movie_id)
    print(url)
    html = requests.get(url)
    parser = BeautifulSoup(html.content, 'html.parser')
    img = ''
    try:
        img_element = parser.select(
            '#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img'
        )
        img = img_element[0]['src']
    except Exception as error:
        print(error)
    return img


def get_img_for_all_movies(movies):
    for boxoffice_id, imbd_content in movies.items():
        print(imbd_content['title'])
        img = get_img_for_one_movie(imbd_content['link'])
        imbd_content['img'] = img
    return movies


def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return data


def write_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)


def main(input_file, output_file='out.json'):
    data = read_json(input_file)
    movies_with_img = get_img_for_all_movies(data)
    write_json(data, output_file)


if __name__ == '__main__':
    if len(sys.argv) == 3:
        main(sys.argv[1], sys.argv[2])
    else:
        main(sys.argv[1])
