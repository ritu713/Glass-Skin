from data_processing import data, ohe, LABELS
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

#utility function
def wrap(product):
    result = {}
    result['brand'] = product[0]
    result['name'] = product[1]
    result['price'] = product[2]
    result['url'] = product[3]
    result['skin type'] = product[4]
    result['concern'] = str(product[5]).split(',')
    return result

#find cosine similarity and return the closest 5 products
def recommended_cosine(vector = None, label = None):
    suggested_products = []
    count = 5
    if (vector):
        fv = vector
    
    cosine_values = cosine_similarity(np.array([fv,]), ohe)
    data['cosine'] = cosine_values[0]

    if(label):
        df = data[data['label'] == label]
    else:
        df = data

    recommendations = df.sort_values('cosine', ascending=False).head(count)
    recommendations = recommendations[['brand', 'name', 'price', 'url', 'skin type', 'concern']].to_dict('split')['data']

    for ele in recommendations:
        suggested_products.append(wrap(ele))
    return suggested_products


def recommend_essentials(vector=None):
    response = {}
    for label in LABELS:
        if(vector):
            r = recommended_cosine(vector, label)
        response[label] = r
    return response
