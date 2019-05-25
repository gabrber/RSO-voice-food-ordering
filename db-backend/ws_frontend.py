import asyncio
import websockets


async def update_order_status(websocket, path):
    new_order = await websocket.recv()
    print("Received new order from backend")
    await websocket.send("Frontend received the order")

start_server = websockets.serve(update_order_status, 'localhost', 9002)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
