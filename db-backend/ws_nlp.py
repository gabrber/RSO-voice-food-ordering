import asyncio
import websockets
import json


async def message():
    async with websockets.connect("ws://localhost:9001") as socket:
        msg = {"test_msg": "2"}
        await socket.send(json.dumps(msg))
        print(await socket.recv())

asyncio.get_event_loop().run_until_complete(message())