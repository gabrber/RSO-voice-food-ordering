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
import { sendOrder } from './service_backend';
import { createOrder } from './data/mappers';

const ga = dialogflow();

const Event = {
	SHOW_MENU: 'show_menu_event',
	WANT_ORDER: 'want_order_event',
	END_OF_CONV: 'end_of_conv_event'
};

const Context = {
	INIT_DECISION: 'init_decision_context',
	ORDER_PIZZA: 'order_pizza_context',
	MORE_PIZZAS: 'order_more_pizzas',
	FINISH_ORDER: 'finish_order'
};

enum PizzaSize {
	SMALL,
	BIG
}

// WELCOME conversation

ga.intent('Default Welcome Intent', (conv) => {
	conv.ask(`Cześć. Tu aplikacja ${APP_NAME}!`);

	conv.ask('Czy chcesz poznać nasze menu czy zamówić pizzę?');
	conv.ask(new Suggestions([ 'Pokaż menu', 'Zamów pizzę' ]));

	conv.contexts.set(Context.INIT_DECISION, 1);
});

ga.intent('want-showing-menu', (conv) => conv.followup(Event.SHOW_MENU));
ga.intent('want-order-pizza', (conv) => conv.followup(Event.WANT_ORDER));

// EVENT: show menu

ga.intent('show-menu', (conv) => {
	if (conv.contexts.get(Context.MORE_PIZZAS)) {
		const currentOrder = getCurrentOrder(conv).map((pizzaConv) => pizzaConv.name).join(', ');
		conv.ask(`Dotychczas wybrałeś: ${currentOrder}. Jeszcze coś?`);
		conv.ask('Wybierz pizzę');
	} else {
		conv.ask('Oto nasze menu.');
		conv.ask('Wybierz pizzę z listy, bądź powiedz jej numer. ');
	}
	conv.ask(menuToListResponse(getMenu()));
	if (conv.contexts.get(Context.MORE_PIZZAS)) {
		conv.ask(new Suggestions('To wszystko'));
	}
	conv.contexts.set(Context.ORDER_PIZZA, 1);
});

ga.intent('choose-pizza', (conv, params, option: string) => {
	try {
		const splittedOption = option.split('_');
		const pizzaNumber = parseInt(splittedOption[1]);
		const pizza = getMenu().items[pizzaNumber - 1];

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
	// const order = getCurrentOrder(conv).map((pizza) => pizza.name).join(', ');
	// conv.ask(new Confirmation(`Tutaj pytamy o adres. Twoje zamówienie to: ${order}. Czy potwierdzasz zamówienie?`));
	// conv.contexts.set(Context.ORDER_PIZZA, 1);
});

// This intent should react on actions.intent.DELIVERY_ADDRESS event
ga.intent('delivery-address-complete', (conv) => {
	const arg = conv.arguments.get('DELIVERY_ADDRESS_VALUE');
	if (arg.userDecision === 'ACCEPTED') {
		console.log('DELIVERY_ADDRESS: ' + arg.location);
		conv.data['deliveryAddress'] = mapAddress(arg.location);

		const order = getCurrentOrder(conv).map((pizza) => pizza.name).join(', ');
		conv.ask(`Super. Mam twój adres. Zamawiasz: ${order}`);
		conv.ask(new Confirmation('Czy potwierdzasz zamówienie?'));
		conv.contexts.set(Context.ORDER_PIZZA, 1);
	} else {
		conv.close('Bez twojego adresu nie mogę zrealizować zamówienia.');
	}
});

// This intent should react on actions.intent.CONFIRMATION event
ga.intent('finish-order', async (conv, params, confirmationGranted) => {
	if (confirmationGranted) {
		const order = await sendOrder(createOrder(getCurrentOrder(conv), mockAddress));
		conv.close(`Twoje zamówienie nr ${order.order_id} zostało przekazane do realizacji`);
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
		addressLines: postalAddress.addressLines,
		phone: phoneNumber
	};
};

const getDeliveryAddress = (conv: DialogflowConversation) => {
	return conv.data['deliveryAddress'];
};

const mockAddress: OrderAddress = {
	addressLines: ['Warszawa', 'Chełmska'],
	phone: '+48666777888'
}

function getMenu(): MenuEntity {
	return {
		id: null,
		items: [
			{
				id: null,
				name: 'Margheritta',
				priceSmall: 20.0,
				priceBig: 30.0,
				ingredients: [ 'ser', 'szynka' ],
				imageUrl: 'https://www.kwestiasmaku.com/sites/kwestiasmaku.com/files/ciasto_na_pizze_00.jpg'
			},
			{
				id: null,
				name: 'Serowa',
				priceSmall: 30.0,
				priceBig: 30.0,
				ingredients: [ 'ser', 'ser pleśniowy', 'mozarella' ],
				imageUrl:
					'https://res.cloudinary.com/bnry/image/upload/f_auto/v1551361679/romans/pizza/famished/pizza-supreme-pan'
			},
			{
				id: null,
				name: 'Czekoladowa',
				priceSmall: 80.0,
				priceBig: 30.0,
				ingredients: [ 'ser', 'czekolada', 'salami', 'brokuły', 'rodzynki', 'składnik' ],
				imageUrl: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pizza.png'
			}
		]
	};
}

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
