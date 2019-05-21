# import pymongo
import pprint

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

from flask import Flask, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
 
app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'pizza_db'
app.config['MONGO_URI'] = 'mongodb://rwUser:pizza123@46.101.104.71:27017/pizza_db'
db = 'pizza_db'
mongo = PyMongo(app)

# class Pizza(db.Document):
#     size = db.StringField(required=True)
#     pizza_type = db.StringField(required=True)

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
    # TODO: sprawdzenie czy ten order jest poprawny
    print(new_order)

    orders = mongo.db.orders
    orders.insert(new_order)
    return "Added"

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


