from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import re
import json

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)

# prints out information from http request
@app.route("/test", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def test():
    print(request.get_json());
    return "hi"

if __name__ == "__main__":
    app.run()
