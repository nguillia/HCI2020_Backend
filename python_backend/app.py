# app.py
import sys
import pandas as pd
import numpy as np
import json
import traceback
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

from flask import Flask, request, jsonify

app = Flask(__name__)
df = pd.read_json('./games.json')
df = df.join(df.genres.str.get_dummies("|"))


@app.route('/wake/', methods=['GET'])
def wake():
    print('Waking app...')
    sys.stdout.flush()
    return True


@app.route('/init/', methods=['GET'])
def init():
    print('Generating TF-IDF Matrix...')
    # tf = TfidfVectorizer(analyzer='word',
    #                      ngram_range=(1, 3),
    #                      min_df=0,
    #                      stop_words='english')
    # tfidf_matrix = tf.fit_transform(df['summary'])
    # tfidf_matrix2 = tf.fit_transform(df['summary'][0:10])
    print(df.reindex([89]))
    sys.stdout.flush()
    return 'Done'


@app.route('/cosine_similarity/', methods=['POST'])
def calculate_cos_sim():
    try:
        liked, disliked, genres = parse_request(request.json)
        filtered = filter_df(liked, disliked, genres)

        if len(filtered) > 0:
            similarites = cosine_sim(filtered.copy(), liked)

            filtered = pd.DataFrame(filtered['game'].values, columns=['game'])

            recommendations = list(map(lambda idx: idx[0], sorted(
                enumerate(similarites), key=lambda x: x[1], reverse=True)[:5]))

            recommendations = filtered.loc[recommendations, 'game'].values
            print('COS_SIM RECS', recommendations)
            sys.stdout.flush()

            return jsonify({"recommendations": recommendations.tolist(), "success": True})
        else:
            return jsonify({"recommendations": [], "success": True})
    except Exception as exe:
        traceback.print_exc()
        sys.stdout.flush()
        return jsonify({"error": True, "message": f'Fatal error in cosine_similarity, dump: {exe}'})


@app.route('/tf_idf/', methods=['POST'])
def calculate_tf_idf():
    try:
        liked, disliked, genres = parse_request(request.json)
        liked_games = df[df['game'].isin(liked)].index
        filtered = filter_df(liked, disliked, genres)

        if len(filtered) > 0:
            cosine_similarities = np.load(
                './similarities.npy', allow_pickle=True)

            similarities = cosine_similarities[liked_games[0]]
            for idx in liked_games[1:]:
                similarities = similarities + cosine_similarities[idx]

            recommendations = list(map(lambda idx: idx[0], sorted(
                enumerate(similarities[filtered.index]), key=lambda x: x[1], reverse=True)[:5]))

            filtered = pd.DataFrame(filtered['game'].values, columns=['game'])

            recommendations = filtered.loc[recommendations, 'game'].values
            print('TF_IDF RECS', recommendations)
            sys.stdout.flush()

            return jsonify({"recommendations": recommendations.tolist(), "success": True})
        else:
            return jsonify({"recommendations": [], "success": True})
    except Exception as exe:
        traceback.print_exc()
        sys.stdout.flush()
        return jsonify({"error": True, "message": f'Fatal error in tfidf_similarity, dump: {exe}'})


def parse_request(request_dict):
    # request_dict = json.loads(request)
    request_dict['liked_games'] = list(map(
        lambda x: int(x), request_dict['liked_games']))
    request_dict['disliked_games'] = list(map(
        lambda x: int(x), request_dict['disliked_games']))

    print('PARSED INCOMING DATA', request_dict['liked_games'],
          request_dict['disliked_games'], request_dict['genres'])
    sys.stdout.flush()

    return request_dict['liked_games'], request_dict['disliked_games'], request_dict['genres']


def filter_df(liked, disliked, genres):
    filtered = df.copy()
    filtered = filtered[~filtered['game'].isin(liked)]
    filtered = filtered[~filtered['game'].isin(disliked)]
    for genre in genres:
        filtered = filtered[filtered[genre] == 0]
    print('FILTERED REQUEST', df.shape, filtered.shape)
    sys.stdout.flush()
    return filtered


def cosine_sim(filtered, liked):
    cos_sim = 0
    for idx in liked:
        seed = df.loc[df['game'] == idx, '1':'9']
        if (not seed.empty):
            base = filtered.copy().loc[:, '1':'9']
            cos_sim = cos_sim + cosine_similarity(seed, base)[0]
    return cos_sim


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
