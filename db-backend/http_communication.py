# import pymongo


# MONGO_HOST = "46.101.104.71"
# MONGO_PORT = 27017
# MONGO_DB = "pizza"
# MONGO_USER = "rwUser"
# MONGO_PASS = "pizza123"

# con = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
# db = con[MONGO_DB]
# db.authenticate(MONGO_USER, MONGO_PASS)
# post = {"size":"smol"}
# posts = db.pizza
# post_id = posts.insert_one(post).inserted_id
# pprint.pprint(posts.find_one({"size": "medium"}))

import pprint
from flask import Flask, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
import pizza_schemas
import jsonschema
import requests

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'pizza_db'
app.config['MONGO_URI'] = 'mongodb://rwUser:pizza123@46.101.104.71:27017/pizza_db'
db = 'pizza_db'
mongo = PyMongo(app)


@app.route('/', methods=['GET'])
def index():
    query = request.get_json(force=True)
    print(query)
    pizzas = mongo.db.pizzas

    result = pizzas.find(query)
    return dumps(result)


@app.route('/order', methods=['POST'])
def post_order():
    new_order = request.get_json(force=True)
    try:
        jsonschema.validate(instance=new_order, schema=pizza_schemas.new_order_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print(new_order)
    
    orders = mongo.db.orders
    orders.insert(new_order)
    return "Added new order"


@app.route('/new_menu', methods=['POST'])
def new_menu():
    # get new menu
    new_menu = request.get_json(force=True)

    # validate it against json schema
    try:
        jsonschema.validate(instance=new_menu, schema=pizza_schemas.menu_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print(new_menu)

    # update database
    old_menu = mongo.db.pizzas.find_one({})
    mongo.db.pizzas.remove(old_menu)
    mongo.db.pizzas.insert(new_menu)

    # # inform NLP about change in menu
    # url_to_nlp_endpoint = 'http://someurl/update_menu'
    # nlp_credentials = {"api_dev_key": "XXX"}
    # r = requests.post(url_to_nlp_endpoint, nlp_credentials, dumps(new_menu))
    # print(f"NLP responsed: {r}")

    return "Removed old menu and inserted new"


@app.route('/get_menu', methods=['GET'])
def get_menu():
    menu = mongo.db.menu
    result = menu.find({})
    return dumps(result)


if __name__ == '__main__':
    app.run(debug=True)
# class Pizza(db.Document):
#     size = db.StringField()

# p = Pizza(size = "smoll", pizza_type = "Hawaii")
# # # p.switch_collection('pizza')
# p.save()

# a = Pizza.query.filter(Pizza.pizza_type == "Hawaii").first()
# pprint.pprint(a)


