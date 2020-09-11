import json
import re
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import aspect_based_sentiment_analysis as absa
from pprint import pprint

app = Flask(__name__)
cors = CORS(app)

nlp = absa.load()

@app.route('/')
@cross_origin()
def analyze():
    text = request.args.get('text')
    text = re.sub('<[^<]+?>', '', text)
    aspects = request.args.get('aspects').split(',')

    try:
        results = nlp((text), aspects=aspects)
    except Exception as e:
        return {
            "error": str(e)
        }

    response = {}
    for result in results:
        if result.sentiment == 0:
            sentiment = 'neutral'
        if result.sentiment == 1:
            sentiment = 'negative'
        if result.sentiment == 2:
            sentiment = 'positive'
        response[result.aspect] = {
            "sentiment": sentiment,
            "scores": result.scores
        }

    return {
        "results": response
    }
