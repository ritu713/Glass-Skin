from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from dotenv import load_dotenv
from skincare_recommender_model import recommend_essentials

app = Flask(__name__)
load_dotenv()
CORS(app, supports_credentials=True)

@app.route("/", methods=['GET'])
def fun():
    return jsonify({"message" : "Server up and running!"}), 200


@app.route('/recommend_products', methods=['POST'])
def recommendations():
    try:
        input = request.json
        prods = recommend_essentials(vector = input)
        return jsonify({"message" : json.dumps(prods)})
    except Exception as e:
        return jsonify({'message' : str(e)}),  500


if(__name__ == '__main__'):
    app.run(debug=True)