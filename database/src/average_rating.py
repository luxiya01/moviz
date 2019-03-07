import json
from collections import defaultdict


def get_data(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)
    return data


def get_movies_per_country(movie_data):
    countries = defaultdict(list)
    for key, value in movie_data.items():
        if 'country' in value and 'rating' in value:
            for c in value['country']:
                countries[c].append(key)
    return countries


def get_movies_rating_per_country(movie_data):
    movies_per_country = get_movies_per_country(movie_data)
    ratings = defaultdict(list)
    for country, movies in movies_per_country.items():
        for movie in movies:
            ratings[country].append(movie_data[movie]['rating'])
    return ratings


def get_average_rating_per_country(movie_data):
    ratings = get_movies_rating_per_country(movie_data)
    average_rating = defaultdict(int)
    for country, rating_list in ratings.items():
        average_rating[country] = sum([float(x) for x in rating_list
                                       ]) / len(rating_list)
    return average_rating


def construct_country_json(countries, ratings, average_rating):
    country_data = defaultdict(dict)
    for c, movies in countries.items():
        country_data[c]['movies'] = movies
        country_data[c]['ratings'] = ratings[c]
        country_data[c]['average_rating'] = average_rating[c]
    return country_data


def data_to_json(dictionary, filename):
    with open(filename, 'w') as f:
        json.dump(dictionary, f)


def main():
    movie_data = get_data('merged_data.json')
    countries = get_movies_per_country(movie_data)
    data_to_json(countries, 'movies_per_country.json')
    ratings = get_movies_rating_per_country(movie_data)
    average_rating = get_average_rating_per_country(movie_data)
    data_to_json(average_rating, 'average_rating.json')
    country_json = construct_country_json(countries, ratings, average_rating)
    data_to_json(country_json, 'countries_data.json')


if __name__ == '__main__':
    main()
