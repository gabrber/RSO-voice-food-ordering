var app = require('express')();
var cors = require('cors');
app.use(cors());

var server = require('http').Server(app);
var io = require('socket.io')(server);

const menu = [
  {
    pizza_id: 1,
    ingredients: 'ser, szynka',
    name: 'margherita',
    pizza_img:
      'http://www.kingcoconutnegombo.com/media/k2/items/cache/802a9daf23bff040c546f525d4bd22bc_XL.jpg',
    price_big: 25,
    price_small: 20
  }
];

const order = {
  order_id: 1,
  orders: [
    {
      pizza_id: 2,
      name: 'margherita',
      size: 'small'
    }
  ],
  address: {
    city: 'Warszawa',
    street: 'Kappowska',
    building: '6',
    flat: '6'
  },
  status: 'accepted'
};

var num = 1;

io.on('connection', function(socket) {
  console.log('hello');
  socket.on('get_menu', () => {
    socket.emit('menu', menu);
  });

  socket.on('new_menu', new_menu => {
    socket.emit('menu', new_menu);
  });

  socket.on('update_order', update => {
    socket.emit('new_order', { ...order, ...update });
  });

  socket.on('login', user => {
    console.log(user);
    socket.emit('user', 'admin');
    socket.emit('new_order', { ...order, order_id: 1 });
    socket.emit('new_order', { ...order, order_id: 2 });
    socket.emit('new_order', { ...order, order_id: 3 });
    socket.emit('new_order', { ...order, order_id: 1, status: 'preparing' });
  });
});

const port = 9999;
io.listen(port);
console.log('Listening on port' + port + '...');
