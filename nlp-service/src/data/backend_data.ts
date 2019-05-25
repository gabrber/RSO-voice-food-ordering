export interface Order {
	order_id?: string;
    orders: PizzaOrderItem[];
    phone: string;
    addressLines: string[];
}

interface PizzaOrderItem {
	pizza: string;
	size: string;
}