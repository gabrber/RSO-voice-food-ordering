import asyncio
import websockets
from flask import Flask, request
from flask_pymongo import PyMongo
import pizza_schemas
import jsonschema
import json

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'pizza_db'
app.config['MONGO_URI'] = 'mongodb://rwUser:pizza123@46.101.104.71:27017/pizza_db'
db = 'pizza_db'
mongo = PyMongo(app)


async def new_order_channel(websocket, path):
    # read new order from NLP backend
    new_order = await websocket.recv()
    new_order = json.loads(new_order)

    # validate new order against json schema
    try:
        jsonschema.validate(instance=new_order, schema=pizza_schemas.new_order_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print(new_order)

    # update database and message the NLP backend about success
    orders = mongo.db.orders
    orders.insert(new_order)
    await websocket.send("Order inserted into DB")

    # inform Frontend about new order
    async with websockets.connect("ws://localhost:9003") as socket:
        msg = {"test_msg": "2"}
        await socket.send(json.dumps(msg))
        print(await socket.recv())


async def update_order_channel(websocket, path):
    # read new order from NLP backend
    new_update = await websocket.recv()
    new_update = json.loads(new_update)

    # validate new order against json schema
    try:
        jsonschema.validate(instance=new_update, schema=pizza_schemas.update_order_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print(new_update)

    query = {"order_id": new_update["order_id"]}
    order_to_update = mongo.db.orders.find_one(query)
    order_to_update["state"] = new_update["state"]
    mongo.db.orders.save(order_to_update)
    await websocket.send("Order updated")

start_server1 = websockets.serve(new_order_channel, 'localhost', 9001)
start_server2 = websockets.serve(update_order_channel, 'localhost', 9002)
asyncio.get_event_loop().run_until_complete(start_server1)
asyncio.get_event_loop().run_until_complete(start_server2)
asyncio.get_event_loop().run_forever()
