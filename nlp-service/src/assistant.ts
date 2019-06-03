import { dialogflow, Suggestions, List, DialogflowConversation, GoogleActionsV2Location } from 'actions-on-google';
import { APP_NAME } from './info';
import { PizzaEntity, MenuEntity } from './data/entities';
import {
	OptionItems,
	OptionItem,
	Image,
	DeliveryAddress,
	convert,
	Confirmation
} from 'actions-on-google/dist/service/actionssdk';
import { PizzaOrderConv, OrderAddress } from './data/conv_data';
import { connect } from 'net';
import { sendOrder, getOrderStatus } from './service_backend';
import { createOrder } from './data/mappers';
import { Order, OrderStatus } from './data/backend_data';
import { getCurrentMenu } from './service_local';
import { getMongoRepository } from 'typeorm';

const ga = dialogflow();

const menuRepository = () => getMongoRepository(MenuEntity);

const Event = {
	SHOW_MENU: 'show_menu_event',
	WANT_ORDER: 'want_order_event',
	END_OF_CONV: 'end_of_conv_event'
};

const Context = {
	INIT_DECISION: 'init_decision_context',
	ORDER_PIZZA: 'order_pizza_context',
	ORDER_PIZZA_FALLBACK: 'order_pizza_fallback',
	MORE_PIZZAS: 'order_more_pizzas',
	FINISH_ORDER: 'finish_order',
	CHOOSE_PIZZA: 'choose_pizza'
};

enum PizzaSize {
	SMALL,
	BIG
}

// WELCOME conversation

ga.intent('Default Welcome Intent', (conv) => {
	conv.ask(`Cześć. Tu aplikacja ${APP_NAME}!`);

	conv.ask('Czy chcesz poznać nasze menu czy sprawdzić status ostatniego zamówienia?');
	conv.ask(new Suggestions([ 'Pokaż menu', 'Sprawdź status zamówienia' ]));

	conv.contexts.set(Context.INIT_DECISION, 1);
});

ga.intent('Default Fallback Intent', (conv) => {
	if (conv.contexts.get(Context.ORDER_PIZZA)) {
		conv.contexts.set(Context.ORDER_PIZZA_FALLBACK, 1);
		conv.followup(Event.SHOW_MENU);
	}
	conv.ask('Nie rozumiem. Czy możesz powtórzyć?');
});

ga.intent('want-showing-menu', (conv) => conv.followup(Event.SHOW_MENU));
ga.intent('want-order-pizza', (conv) => conv.followup(Event.WANT_ORDER));

// CHECK LATEST order status
ga.intent('get-order-status', async (conv) => {
	switch (await getOrderStatus(getLatestSentOrder(conv))) {
		case OrderStatus.accepted:
			conv.close('Twoje ostatnie zamówienie zostało przyjęte przez restaurację');
			break;
		case OrderStatus.preparing:
			conv.close('Twoje ostatnie zamówienie jest przygotowywane');
			break;
		case OrderStatus.delivering:
			conv.close('Twoje ostatnie zamówienie jest w drodze.');
			break;
		case OrderStatus.cancelled:
			conv.close('Przepraszamy. Twoje ostatnie zamówienie zostało anulowane.');
			break;
	}
});

// EVENT: show menu

ga.intent('show-menu', async (conv) => {
	if (conv.contexts.get(Context.ORDER_PIZZA_FALLBACK)) {
		conv.ask('Nie rozpoznałem nazwy pizzy. Spróbuj jeszcze raz.');
	}
	if (conv.contexts.get(Context.MORE_PIZZAS)) {
		const currentOrder = getCurrentOrder(conv).map((pizzaConv) => pizzaConv.name).join(', ');
		conv.ask(`Dotychczas wybrałeś: ${currentOrder}. Jeszcze coś?. Wybierz pizzę`);
	} else {
		conv.ask('Oto nasze menu. Wybierz pizzę z listy, bądź powiedz jej numer. ');
	}
	const localMenu = await getCurrentMenu(menuRepository());
	conv.ask(menuToListResponse(localMenu));
	if (conv.contexts.get(Context.MORE_PIZZAS)) {
		conv.ask(new Suggestions('To wszystko'));
	}
	conv.contexts.set(Context.ORDER_PIZZA, 1);
});

ga.intent('choose-pizza', async (conv, params, option: string) => {
	try {
		const splittedOption = option.split('_');
		const pizzaNumber = parseInt(splittedOption[1]);
		const menu = await getCurrentMenu(menuRepository());
		const pizza = menu.items[pizzaNumber - 1];

		savePizzaInOrder(conv, pizza, PizzaSize.SMALL);

		conv.contexts.set(Context.ORDER_PIZZA, 1);
		conv.contexts.set(Context.MORE_PIZZAS, 1);
		conv.followup(Event.SHOW_MENU);
	} catch (err) {
		console.log(err);
		conv.ask('Coś poszło nie tak. Spróbujmy jeszcze raz');
		conv.followup(Event.SHOW_MENU);
	}
});

ga.intent('choose-pizza-end', (conv) => {
	conv.ask(
		new DeliveryAddress({
			addressOptions: {
				reason: 'Aby dowieźć twoje zamówienie'
			}
		})
	);
});

// This intent should react on actions.intent.DELIVERY_ADDRESS event
ga.intent('delivery-address-complete', (conv) => {
	const arg = conv.arguments.get('DELIVERY_ADDRESS_VALUE');
	if (arg.userDecision === 'ACCEPTED') {
		saveDeliveryAddress(conv, mapAddress(arg.location));

		const order = getCurrentOrder(conv).map((pizza) => pizza.name).join(', ');
		const cost = getCurrentOrder(conv).reduce((aggregatedCost, pizza) => aggregatedCost + pizza.price, 0);

		conv.ask(
			new Confirmation(`Super. Mam twój adres. Zamawiasz: ${order}.
			Koszt zamówienia wynosi: ${cost} Czy potwierdzasz zamówienie?`)
		);
		conv.contexts.set(Context.ORDER_PIZZA, 1);
	} else {
		conv.close('Bez twojego adresu nie mogę zrealizować zamówienia.');
	}
});

// This intent should react on actions.intent.CONFIRMATION event
ga.intent('finish-order', async (conv, params, confirmationGranted) => {
	if (confirmationGranted) {
		try {
			const order = await sendOrder(createOrder(getCurrentOrder(conv), getDeliveryAddress(conv)));
			saveSentOrder(conv, order);
			conv.close(`Twoje zamówienie zostało przekazane do realizacji`);
		} catch (err) {
			console.log(err);
			conv.close('Przepraszam. Wystąpił błąd. Niestety nie mogę zrealizować twojego zamówienia. Skontaktuj się z restauracją.');			
		}
	} else {
		conv.close('Przykro mi, że nie mogę zrealizować twojego zamówienia.');
	}
});

const getCurrentOrder = (conv: DialogflowConversation) => {
	let order: PizzaOrderConv[];
	if (Object.keys(conv.data).findIndex((key) => key == 'order') != -1) {
		// there is pizza stored in conversation storage
		order = conv.data['order'];
	} else {
		order = [];
	}
	return order;
};

const getLatestSentOrder = (conv: DialogflowConversation): string => {
	return conv.user.storage['latestOrder'];
};

const saveSentOrder = (conv: DialogflowConversation, order: Order) => {
	conv.user.storage['latestOrder'] = order.order_id;
};

const savePizzaInOrder = (conv: DialogflowConversation, pizza: PizzaEntity, size: PizzaSize) => {
	let order: PizzaOrderConv[];
	if (Object.keys(conv.data).findIndex((key) => key == 'order') != -1) {
		// there is pizza stored in conversation storage
		order = conv.data['order'];
	} else {
		order = [];
	}
	const updatedOrder = order.concat([
		{
			id: 'pizza.id.toString()',
			name: pizza.name,
			size: `${size}`,
			price: size == PizzaSize.SMALL ? pizza.priceSmall : pizza.priceBig
		}
	]);
	conv.data['order'] = updatedOrder;
};

const mapAddress = ({ postalAddress, phoneNumber }: GoogleActionsV2Location): OrderAddress => {
	return {
		phone: phoneNumber,
		city: postalAddress.locality + ', ' + postalAddress.addressLines
	};
};

const getDeliveryAddress = (conv: DialogflowConversation) => {
	return conv.data['deliveryAddress'];
};

const saveDeliveryAddress = (conv: DialogflowConversation, address: OrderAddress) => {
	conv.data['deliveryAddress'] = address;
};

const mockAddress: OrderAddress = {
	phone: '+48666777888',
	city: 'Warszawa, Chełmska 22'
};

function menuToListResponse(menu: MenuEntity): List {
	function pizzaToItem(pizza: PizzaEntity, index: number): OptionItem {
		return {
			title: index + '. ' + pizza.name,
			synonyms: [ index.toString() ],
			description: 'Cena: ' + pizza.priceSmall + '. Składniki: ' + pizza.ingredients.join(', '),
			image: new Image({
				url: pizza.imageUrl,
				alt: 'Pizza Image'
			})
		};
	}
	let items: OptionItems = {};
	menu.items.forEach((pizza, index) => {
		const key = `PIZZA_${index + 1}`;
		items[key] = pizzaToItem(pizza, index + 1);
	});

	return new List({
		title: 'Menu restauracji',
		items
	});
}

export default ga;
