import socketio
from flask_socketio import emit
import json
sio = socketio.Client()


@sio.on('server_status')
def asd(data):
    print(f"{data}")
    # sio.emit("new_menu", json.dumps([{"menu_id": 100, "name": "n1", "price_small": 2, "price_big": 3, "ingredients": ["i1"], "pizza_img": "img1"}, {"menu_id": 102, "name": "n1", "price_small": 2, "price_big": 3, "ingredients": ["i1"], "pizza_img": "img1"}]))
    sio.emit("get_menu")


@sio.on('menu')
def asd(data):
    print(f"{data}")


if __name__ == '__main__':
    sio.connect('http://localhost:5000')