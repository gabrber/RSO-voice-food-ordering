from flask import Flask, request
import socketio
import pizza_schemas
import jsonschema
from random import randint
import json
from flask_pymongo import PyMongo
from bson.json_util import dumps
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

sio = socketio.Server()
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

mongoapp = Flask(__name__)
mongoapp.config['MONGO_DBNAME'] = 'pizza_db'
mongoapp.config['MONGO_URI'] = 'mongodb://rwUser:pizza123@46.101.104.71:27017/pizza_db'
db = 'pizza_db'
mongo = PyMongo(mongoapp)


@app.route('/order', methods=['POST'])
def new_order():
    """
    Endpoint for receiving new order activated by NLP. When activated answers with order id, inserts order into database
    and sends the order to frontend via websocket.

    Returns
    -------
        str
            info about success or error
    """

    print('new order received')
    new_order = request.get_json(force=True)

    try:
        jsonschema.validate(instance=new_order, schema=pizza_schemas.new_order_schema_wo_id)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"

    new_order_id = randint(0, 9999999999)
    new_order["order_id"] = new_order_id
    new_order["state"] = "accepted"

    # update database
    orders = mongo.db.orders
    orders.insert(new_order)
    print("Database updated")
    new_order.pop('_id', None)

    # inform Frontend about new order
    sio.emit('new_order', data=json.dumps(new_order))
    print("=========== End of function ===========")

    return json.dumps(new_order)


@app.route('/get_menu', methods=['GET'])
def get_menu():
    """
    Endpoint for getting menu.

    Returns
    -------
       json
            menu in json format
    """
    menu = mongo.db.pizzas
    result = menu.find_one({})
    print(result)
    return json.dumps(result['menu'])


@app.route('/get_order_status/<order_id>', methods=['GET'])
def get_state(order_id):
    """
    Endpoint for getting current order state.

    Returns
    -------
       json with request_id and current state of the requested order

    """
    # get request
    # state_req = request.get_json(force=True)
    print("Order id " + str(order_id))

    # query
    query_result = mongo.db.orders.find_one({"order_id": int(order_id)})
    # answer
    answer = {"state": query_result["state"]}
    return dumps(answer)


# stub for action when someone connects
@sio.on("connect", namespace="/")
def connect(arg1,arg2):
    sio.emit("server_status", "server_up")
    print("connect ")

@sio.on('login')
def login(user):
    sio.emit("user", 'admin')
    print('connect')


@sio.on('update_order')
def update_order_handler(new_update):
    """
        Channel for updating order communication. Activated when server gets message with order update request from Backend.
        After validating order update updates DB and respond to Frontend updated order.
    """
    # read order update from Frontend
    new_update = json.loads(new_update)
    print("Received update status request")
    print(new_update)

    # validate new order against json schema
    try:
        jsonschema.validate(instance=new_update, schema=pizza_schemas.update_order_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print("Update validated")

    # update DB
    query = {"order_id": new_update["order_id"]}
    order_to_update = mongo.db.orders.find_one(query)
    order_to_update["state"] = new_update["state"]
    mongo.db.orders.save(order_to_update)
    print("Database updated")

    # respond to Frontend
    order_to_update.pop("_id")
    sio.emit("new_order", json.dumps(order_to_update))


@sio.on('new_menu')
def new_menu_handler(new_menu):
    """
        Channel for updating menu. Activated when server gets message with order update request from Backend.
        After validating menu updates DB and respond to Frontend with new menu.
        """
    # read new menu from Frontend
    new_menu = json.loads(new_menu)
    print("Received new menu")
    print(new_menu)

    # validate it against json schema
    try:
        jsonschema.validate(instance=new_menu, schema=pizza_schemas.menu_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"

    # update database
    old_menu = mongo.db.pizzas.find_one({})
    mongo.db.pizzas.remove(old_menu)
    mongo.db.pizzas.insert({"menu": new_menu})

    # Send new menu to NLP service
    requests.post('https://rso-restaurant-ga.herokuapp.com/new_menu', data=new_menu, json=True)

    # respond
    sio.emit("menu", json.dumps(new_menu))


@sio.on('get_menu')
def get_menu_handler():
    """
        Channel for getting menu. Activated on Frontend request, responds with current menu.
        """
    print("Received new menu request")

    # search database
    menu = mongo.db.pizzas.find_one({})

    # respond
    sio.emit("menu", json.dumps(menu["menu"]))


if __name__ == '__main__':
    app.run(host='0.0.0.0')
