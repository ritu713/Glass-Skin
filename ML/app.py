from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import os
from dotenv import load_dotenv
from skincare_recommender_model import recommend_essentials

app = Flask(__name__)
load_dotenv()
CORS(app, supports_credentials=True)

@app.route("/", methods=['GET'])
def fun():
    return jsonify({"message" : "Server up and running!"}), 200

def verify_source(f):
    def wrapper(*args, **kwargs):
        if (request.host_url == os.environ.get('NODE_URL')):
            next()
        else :
            return jsonify({'message' : 'Unauthorized'}), 403
    return wrapper


@app.route('/recommendation_model', methods=['POST'])
@verify_source
def recommendations():
    try:
        input = request.json
        prods = recommend_essentials(vector = input)
        return jsonify({"message" : json.dumps(prods)})
    except Exception as e:
        return jsonify({'message' : str(e)}),  500


if(__name__ == '__main__'):
    app.run(debug=True)