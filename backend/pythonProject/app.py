from flask import Flask, request
from flask_restful import Resource, Api, reqparse
import json
from flask import jsonify

# Flask Constructor
app = Flask(__name__)


# decorator to associate
# a function with the url
@app.route("/")
def showHomePage():
    # response from the server
    return "<title>Hello from Back-end</title>"


if __name__ == "__main__":
    app.run(host="0.0.0.0")