import { Order, OrderStatus, OrderStatusResponse, mapOrderStatus } from './data/backend_data';
import { PizzaJSON } from './data/interfaces';
import { RESTAURANT_BACKEND_URL } from './info';
import fetch from 'node-fetch';
import WebSocket = require('websocket-as-promised');
import { print } from 'util';

const url = process.env.RESTAURANT_BACKEND_WEBSOCKET || 'ws://websocket.url';
const orderWebsocket = new WebSocket(url, {
	packMessage: JSON.stringify,
	unpackMessage: JSON.parse,
	attachRequestId: (data, requestId) => Object.assign({ requestId }, data),
	extractRequestId: (data) => data && data.requestId
});

export const sendOrder = async (order: Order): Promise<Order> => {
	print(`sendOrder: ${order}`);
	// mock
	return Promise.resolve<Order>({
		...order,
		order_id: 'order_id'
	});
	// remote
	const response = await orderWebsocket.sendRequest(order);

	return { ...response };
};

export const getRemoteMenu = async (): Promise<PizzaJSON[]> => {
	// mock
	return [
		{
			menu_id: 'menu_id',
			name: 'Serowa',
			price_small: 20.0,
			price_big: 40.0,
			ingredients: [ 'ser', 'gorgonzola', 'ser pleśniowy' ],
			image_url: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pizza.png'
		},
		{
			menu_id: 'menu_id',
			name: 'Capri',
			price_small: 30.0,
			price_big: 50.0,
			ingredients: [ 'ser', 'szynka', 'ser pleśniowy' ],
			image_url: 'https://www.kwestiasmaku.com/sites/kwestiasmaku.com/files/ciasto_na_pizze_00.jpg'
		},
		{
			menu_id: 'menu_id',
			name: 'Margheritta',
			price_small: 15.0,
			price_big: 20.0,
			ingredients: [ 'ser', 'sos pomidorowy' ],
			image_url: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pizza.png'
		}
	];
	// remote
	const options = {
		uri: `${RESTAURANT_BACKEND_URL}/get_menu`,
		json: true
	};
	const response = await fetch(options.uri);
	const menu: PizzaJSON[] = await response.json();
};

export const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
	// mock
	return OrderStatus.delivering;

	// remote
	const uri = `${RESTAURANT_BACKEND_URL}/get_order_status/${orderId}`;
	const response = await fetch(uri);
	const orderStatusResponse: OrderStatusResponse = await response.json();

	return mapOrderStatus(orderStatusResponse.status);
};
