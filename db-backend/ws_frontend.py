import asyncio
import websockets
import json


async def update_order_status(websocket, path):
    new_order = await websocket.recv()
    print(new_order)
    new_order = json.loads(new_order)
    print("Received new order from backend")
    await websocket.send("Order accepted!")
    print("Delivery...")
    print("Order fulfilled")
    print(new_order["order_id"])

    async with websockets.connect("ws://localhost:9002") as socket:
        msg = {"order_id": new_order["order_id"], "state": "done"}
        await socket.send(json.dumps(msg))
        print("Order update sent to backend")
        back_res = await socket.recv()
        print(f"Backend response: <<{back_res}>>")


start_server = websockets.serve(update_order_status, 'localhost', 9003)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
