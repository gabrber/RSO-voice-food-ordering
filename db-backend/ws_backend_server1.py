"""Websocket communication with NLP Backend and Frontend"""

import asyncio
import websockets
from flask import Flask
from flask_pymongo import PyMongo
import pizza_schemas
import jsonschema
import json
from random import randint

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'pizza_db'
app.config['MONGO_URI'] = 'mongodb://rwUser:pizza123@46.101.104.71:27017/pizza_db'
db = 'pizza_db'
mongo = PyMongo(app)


async def new_order_channel(websocket, path):
    """
    Channel for new order communication. Activated when server gets message with new order from NLP. After validating
    new order updates DB, sends order to Frontend and if that was successful sends order id to NLP.
    """
    # read new order from NLP backend
    new_order_raw = await websocket.recv()
    new_order = json.loads(new_order_raw)
    print("Received order from NLP!")

    # validate new order against json schema
    try:
        jsonschema.validate(instance=new_order, schema=pizza_schemas.new_order_schema_wo_id)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print("Order validated")
    new_order_id = randint(0, 9999999999)
    new_order["order_id"] = new_order_id

    # update database and message the NLP backend about success
    orders = mongo.db.orders
    orders.insert(new_order)
    print("Database updated")
    new_order.pop('_id', None)

    # inform Frontend about new order
    async with websockets.connect("ws://localhost:9003") as socket:
        await socket.send(json.dumps(new_order))
        print("Order passed to Frontend")
        front_response = await socket.recv()
        print(f"Received response from Frontend: <<{front_response}>>")
    # TODO: jesli odpowiedz jest ze accepted to wyslac id nlpowi a jak denied to wyslac mu -1 czy cos.
    await websocket.send(json.dumps({"order_id": new_order_id}))
    print(f"frontend response <<{front_response}>>")
    print("=========== End of function ===========")


async def update_order_channel(websocket, path):
    """
    Channel for updating order communication. Activated when server gets message with order update request from Backend.
    After validating order update updates DB and respond to Frontend with info about error or success.
    """
    # read new order from NLP backend
    new_update = await websocket.recv()
    new_update = json.loads(new_update)
    print("Received order update from Frontend!")
    print(new_update)

    # validate new order against json schema
    try:
        jsonschema.validate(instance=new_update, schema=pizza_schemas.update_order_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print("Update validated")

    query = {"order_id": new_update["order_id"]}
    order_to_update = mongo.db.orders.find_one(query)
    order_to_update["state"] = new_update["state"]
    mongo.db.orders.save(order_to_update)
    print("Database updated")
    await websocket.send("Order updated")


start_server1 = websockets.serve(new_order_channel, 'localhost', 9001)
start_server2 = websockets.serve(update_order_channel, 'localhost', 9002)
asyncio.get_event_loop().run_until_complete(start_server1)
asyncio.get_event_loop().run_until_complete(start_server2)
asyncio.get_event_loop().run_forever()
