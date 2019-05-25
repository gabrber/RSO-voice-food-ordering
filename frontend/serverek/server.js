const io = require("socket.io")();

const menu = [
  {
    id: 1,
    ingredients: ["ser", "szynka"],
    name: "margherita",
    pizza_img:
      "http://www.kingcoconutnegombo.com/media/k2/items/cache/802a9daf23bff040c546f525d4bd22bc_XL.jpg",
    price_big: 25,
    price_small: 20
  }
];

const order = {
  id: 1,
  orders: [
    {
      id: 2,
      name: "margherita",
      size: "small"
    }
  ],
  address: {
    city: "Warszawa",
    street: "Kappowska",
    building: "6",
    flat: "6"
  }
};

var num = 1;

io.on("connection", function (socket) {
  console.log("hello");
  socket.on("get_menu", () => {
    socket.emit("menu", menu);
  });

  socket.on('new_menu', (new_menu) => {
    socket.emit('menu', new_menu)
  })

  // setInterval(() => {
  //   console.log("WYSYLYM NEW ORDER");
  //   num = num + 1;
  //   let new_order = { ...order, id: num };
  //   console.log(new_order);
  //   socket.emit("new_order", new_order);
  // }, 5000);

  socket.emit("new_order", { ...order, id: 1 });
  socket.emit("new_order", { ...order, id: 2 });
  socket.emit("new_order", { ...order, id: 3 });
  socket.emit("new_order", { ...order, id: 4 });
});

const port = 9999;
io.listen(port);
console.log("Listening on port" + port + "...");