import json
import sys


def write_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f)


def merge_imdb_boxoffice_info(imdb_movie_file, revenue_file):
    imdb_movie_dict = load_json(imdb_movie_file)
    boxoffice_dict = load_json(revenue_file)

    for boxoffice_id, movie_dict in imdb_movie_dict.items():
        if boxoffice_id in boxoffice_dict:
            boxoffice = boxoffice_dict[boxoffice_id]
            if 'Domestic Total Gross' in boxoffice:
                movie_dict['domestic_total_gross'] = parse_num(
                    boxoffice['Domestic Total Gross'])
            if 'Foreign Total Gross' in boxoffice:
                movie_dict['foreign_total_gross'] = parse_num(
                    boxoffice['Foreign Total Gross'])
            if 'Country Total Gross' in boxoffice:
                movie_dict['country_total_gross'] = parse_country_total_gross(
                    boxoffice)
    return imdb_movie_dict


def load_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
    return data


def parse_num(dollar_str):
    if dollar_str is None:
        return 0
    cleaned_str = dollar_str[1:].split('(')[0].replace(',', '').replace(
        ' ', '')
    try:
        value = int(cleaned_str)
    except:
        value = 0
    return value


def parse_country_total_gross(boxoffice_dict):
    country_total_gross = dict()
    switzerland_tmp = 0
    for country, value in boxoffice_dict['Country Total Gross'].items():
        if (country == 'Switzerland (German-speaking)'
                or country == 'Switzerland (French-speaking)'):
            switzerland_tmp += parse_num(value)
        else:
            country_total_gross[country] = parse_num(value)
    if switzerland_tmp > 0:
        country_total_gross['Switzerland'] = switzerland_tmp
    country_total_gross['USA'] = parse_num(
        boxoffice_dict['Domestic Total Gross'])
    return country_total_gross


if __name__ == '__main__':
    imdb_movie_file = sys.argv[1]
    revenue_file = sys.argv[2]
    output_file = sys.argv[3]
    merged_data = merge_imdb_boxoffice_info(imdb_movie_file, revenue_file)
    write_json(merged_data, output_file)
