import { Order, OrderStatus, OrderStatusResponse, mapOrderStatus } from './data/backend_data';
import { PizzaJSON } from './data/interfaces';
import { RESTAURANT_BACKEND_URL } from './info';
import fetch from 'node-fetch';
import * as request from 'request-promise-native'
import WebSocket = require('websocket-as-promised');
import { print } from 'util';

export const sendOrder = async (order: Order): Promise<Order> => {
	print(`sendOrder: ${order}`);
	const requestOptions = {
		uri: `${RESTAURANT_BACKEND_URL}/order`,
		method: 'POST',
		json: true,
		body: order
	}
	const response: Order = await request(requestOptions)

	console.log('sendOrder, response.id = ' + response.order_id)

	return { ...response };
};

export const getRemoteMenu = async (): Promise<PizzaJSON[]> => {
	// remote
	const options = {
		uri: `${RESTAURANT_BACKEND_URL}/get_menu`,
		json: true
	};
	const response = await request(options)
	return response
};

export const getOrderStatus = async (orderId: string): Promise<OrderStatus> => {
	// // mock
	// return OrderStatus.delivering;

	// remote
	const options = {
		uri: `${RESTAURANT_BACKEND_URL}/get_order_status/${orderId}`,
		json: true
	}
	const response: OrderStatusResponse = await request(options)

	return mapOrderStatus(response.state);
};
