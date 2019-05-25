import { Order } from './data/backend_data';

export const sendOrder = async (order: Order): Promise<Order> => {
	return Promise.resolve<Order>({
		...order,
		order_id: 'order_id'
	});
};
