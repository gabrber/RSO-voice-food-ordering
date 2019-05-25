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
        jsonschema.validate(instance=new_order, schema=pizza_schemas.test_schema)
    except jsonschema.ValidationError:
        print("JSON Validation Error, bad data. Entry not added do DB")
        return "JSON Validation Error, bad data. Entry not added do DB"
    print(new_order)

    # update database and message the NLP backend about success
    orders = mongo.db.orders
    orders.insert(new_order)
    await websocket.send("Order inserted into DB")

    # inform Frontend about new order
    async with websockets.connect("ws://localhost:9002") as socket:
        msg = {"test_msg": "2"}
        await socket.send(json.dumps(msg))
        print(await socket.recv())


start_server = websockets.serve(new_order_channel, 'localhost', 9001)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()