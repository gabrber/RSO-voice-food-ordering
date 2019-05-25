import asyncio
import websockets
import json


async def update_order_status(websocket, path):
    new_order = await websocket.recv()
    print("Received new order from backend")
    await websocket.send("Frontend received the order")

    async with websockets.connect("ws://localhost:9002") as socket:
        msg = {"order_id": "001", "state": "done"}
        await socket.send(json.dumps(msg))
        print(await socket.recv())

start_server = websockets.serve(update_order_status, 'localhost', 9003)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
