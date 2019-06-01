export interface PizzaModel {
  id: number;
  name: string;
  price_small: number;
  price_big: number;
  ingredients: string[];
  pizza_img: string;
}

export interface OrdersModel {
  id: number;
  orders: [
    {
      id: number;
      name: string;
      size: string;
    }
  ];
  address: {
    city: string;
    street: string;
    building: string;
    flat: string;
  };
  status: string;
}

export interface GlobalModel {
  menu: PizzaModel[];
  orders: OrdersModel[];
  socket: SocketIOClient.Socket;
  isAdmin: boolean;
}
