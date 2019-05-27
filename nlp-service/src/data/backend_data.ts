export interface Order {
	order_id?: string;
	orders: PizzaOrderItem[];
	phone: string;
	address: Address;
}

interface PizzaOrderItem {
	pizza: string;
	size: string;
}

interface Address {
	city: string;
	addressLines: string[];
}

export interface OrderStatusResponse {
	order_id: string;
	status: string;
}

export enum OrderStatus {
	accepted,
	preparing,
	delivering,
	cancelled
}

export const mapOrderStatus = (status: string) => {
	return {
		accepted: OrderStatus.accepted,
		preparing: OrderStatus.preparing,
		delivering: OrderStatus.delivering,
		cancelled: OrderStatus.cancelled
	}[status];
};
