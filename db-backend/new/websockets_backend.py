from flask import Flask
import socketio

app = Flask(__name__)
sio = socketio.Server()

app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)


@app.route('/new_order', methods=['GET'])
def new_order():
    print('get')
    sio.emit('asd', data='message')

    return 'GET get'


if __name__ == '__main__':
    app.run(port=5000)
