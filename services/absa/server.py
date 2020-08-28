import json
from flask import Flask
from flask import request

app = Flask(__name__)
import aspect_based_sentiment_analysis as absa

nlp = absa.load()

@app.route('/')
def hello_world():
    text = request.args.get('text')
    aspect = request.args.get('aspect')
    app.logger.warning(text)
    app.logger.warning(aspect)

    [result] = nlp((text), aspects=[aspect])

    if result.sentiment == 0:
        sentiment = 'neutral'
    if result.sentiment == 1:
        sentiment = 'negative'
    if result.sentiment == 2:
        sentiment = 'positive'

    return json.dumps([sentiment, result.scores])
