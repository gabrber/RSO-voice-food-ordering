import { PizzaOrderConv, OrderAddress } from './conv_data';
import { Order } from './backend_data';

export const createOrder = (pizzas: PizzaOrderConv[], address: OrderAddress): Order => {
	return {
		orders: pizzas.map((pizzaConv) => {
			return {
				pizza: pizzaConv.name,
				size: pizzaConv.size
			};
		}),
		phone: address.phone,
		address: {
			city: address.city
		}
	};
};
