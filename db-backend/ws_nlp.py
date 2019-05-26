import asyncio
import websockets
import json


async def message():
    async with websockets.connect("ws://localhost:9001") as socket:
        msg = {
            "order_id": 1,
            "state": "new",
            "request_id": 123,
            "orders": [{"pizza": "type1", "size": "normal"}],
            "address": {
                    "city": "City1",
                    "street": "Street1",
                    "building": "B1",
                    "flat": "1a"
                }
            }

        await socket.send(json.dumps(msg))
        back_res = await socket.recv()
        print(f"Backend response: <<{back_res}>>")

print("Order sent...")
asyncio.get_event_loop().run_until_complete(message())