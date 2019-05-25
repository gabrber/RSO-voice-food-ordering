import asyncio
import websockets
import json


async def message():
    async with websockets.connect("ws://localhost:9001") as socket:
        msg = {
            "order_id": "001",
            "state": "new",
            "orders": [{"pizza": "type1", "size": "normal"}],
            "address": {
                    "city": "City1",
                    "street": "Street1",
                    "building": "B1",
                    "flat": "1a"
                }
            }

        await socket.send(json.dumps(msg))
        print(await socket.recv())

asyncio.get_event_loop().run_until_complete(message())