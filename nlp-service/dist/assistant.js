"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_on_google_1 = require("actions-on-google");
const info_1 = require("./info");
const entities_1 = require("./data/entities");
const actionssdk_1 = require("actions-on-google/dist/service/actionssdk");
const service_backend_1 = require("./service_backend");
const mappers_1 = require("./data/mappers");
const backend_data_1 = require("./data/backend_data");
const service_local_1 = require("./service_local");
const typeorm_1 = require("typeorm");
const ga = actions_on_google_1.dialogflow();
const menuRepository = typeorm_1.getMongoRepository(entities_1.MenuEntity);
const Event = {
    SHOW_MENU: 'show_menu_event',
    WANT_ORDER: 'want_order_event',
    END_OF_CONV: 'end_of_conv_event'
};
const Context = {
    INIT_DECISION: 'init_decision_context',
    ORDER_PIZZA: 'order_pizza_context',
    MORE_PIZZAS: 'order_more_pizzas',
    FINISH_ORDER: 'finish_order',
    CHOOSE_PIZZA: 'choose_pizza'
};
var PizzaSize;
(function (PizzaSize) {
    PizzaSize[PizzaSize["SMALL"] = 0] = "SMALL";
    PizzaSize[PizzaSize["BIG"] = 1] = "BIG";
})(PizzaSize || (PizzaSize = {}));
// WELCOME conversation
ga.intent('Default Welcome Intent', (conv) => {
    conv.ask(`Cześć. Tu aplikacja ${info_1.APP_NAME}!`);
    conv.ask('Czy chcesz poznać nasze menu czy sprawdzić status ostatniego zamówienia?');
    conv.ask(new actions_on_google_1.Suggestions(['Pokaż menu', 'Sprawdź status zamówienia']));
    conv.contexts.set(Context.INIT_DECISION, 1);
});
ga.intent('Default Fallback Intent', (conv) => {
    if (conv.contexts.get(Context.ORDER_PIZZA)) {
        conv.contexts.set(Context.ORDER_PIZZA, 1);
    }
    conv.ask('Nie rozumiem. Czy możesz powtórzyć?', 'Możesz powtórzyć, o co chodziło?');
});
ga.intent('want-showing-menu', (conv) => conv.followup(Event.SHOW_MENU));
ga.intent('want-order-pizza', (conv) => conv.followup(Event.WANT_ORDER));
// CHECK LATEST order status
ga.intent('get-order-status', async (conv) => {
    switch (await service_backend_1.getOrderStatus(getLatestSentOrder(conv))) {
        case backend_data_1.OrderStatus.accepted:
            conv.close('Twoje ostatnie zamówienie zostało przyjęte przez restaurację');
            break;
        case backend_data_1.OrderStatus.preparing:
            conv.close('Twoje ostatnie zamówienie jest przygotowywane');
            break;
        case backend_data_1.OrderStatus.delivering:
            conv.close('Twoje ostatnie zamówienie jest w drodze.');
            break;
        case backend_data_1.OrderStatus.cancelled:
            conv.close('Przepraszamy. Twoje ostatnie zamówienie zostało anulowane.');
            break;
    }
});
// EVENT: show menu
ga.intent('show-menu', async (conv) => {
    if (conv.contexts.get(Context.MORE_PIZZAS)) {
        const currentOrder = getCurrentOrder(conv).map((pizzaConv) => pizzaConv.name).join(', ');
        conv.ask(`Dotychczas wybrałeś: ${currentOrder}. Jeszcze coś?`);
        conv.ask('Wybierz pizzę');
    }
    else {
        conv.ask('Oto nasze menu.');
        conv.ask('Wybierz pizzę z listy, bądź powiedz jej numer. ');
    }
    const localMenu = await service_local_1.getCurrentMenu(menuRepository);
    conv.ask(menuToListResponse(localMenu));
    if (conv.contexts.get(Context.MORE_PIZZAS)) {
        conv.ask(new actions_on_google_1.Suggestions('To wszystko'));
    }
    conv.contexts.set(Context.ORDER_PIZZA, 1);
});
ga.intent('choose-pizza', async (conv, params, option) => {
    try {
        const splittedOption = option.split('_');
        const pizzaNumber = parseInt(splittedOption[1]);
        const menu = await service_local_1.getCurrentMenu(menuRepository);
        const pizza = menu.items[pizzaNumber - 1];
        savePizzaInOrder(conv, pizza, PizzaSize.SMALL);
        conv.contexts.set(Context.ORDER_PIZZA, 1);
        conv.contexts.set(Context.MORE_PIZZAS, 1);
        conv.followup(Event.SHOW_MENU);
    }
    catch (err) {
        console.log(err);
        conv.ask('Coś poszło nie tak. Spróbujmy jeszcze raz');
        conv.followup(Event.SHOW_MENU);
    }
});
ga.intent('choose-pizza-end', (conv) => {
    conv.ask(new actionssdk_1.DeliveryAddress({
        addressOptions: {
            reason: 'Aby dowieźć twoje zamówienie'
        }
    }));
});
// This intent should react on actions.intent.DELIVERY_ADDRESS event
ga.intent('delivery-address-complete', (conv) => {
    const arg = conv.arguments.get('DELIVERY_ADDRESS_VALUE');
    if (arg.userDecision === 'ACCEPTED') {
        console.log('DELIVERY_ADDRESS: ' + arg.location.postalAddress.addressLines.toString());
        saveDeliveryAddress(conv, mapAddress(arg.location));
        const order = getCurrentOrder(conv).map((pizza) => pizza.name).join(', ');
        const cost = getCurrentOrder(conv).reduce((aggregatedCost, pizza) => aggregatedCost + pizza.price, 0);
        conv.ask(new actionssdk_1.Confirmation(`Super. Mam twój adres. Zamawiasz: ${order}.
			Koszt zamówienia wynosi: ${cost}. Czy potwierdzasz zamówienie?`));
        conv.contexts.set(Context.ORDER_PIZZA, 1);
    }
    else {
        conv.close('Bez twojego adresu nie mogę zrealizować zamówienia.');
    }
});
// This intent should react on actions.intent.CONFIRMATION event
ga.intent('finish-order', async (conv, params, confirmationGranted) => {
    if (confirmationGranted) {
        const order = await service_backend_1.sendOrder(mappers_1.createOrder(getCurrentOrder(conv), getDeliveryAddress(conv)));
        saveSentOrder(conv, order);
        conv.close(`Twoje zamówienie zostało przekazane do realizacji`);
    }
    else {
        conv.close('Przykro mi, że nie mogę zrealizować twojego zamówienia.');
    }
});
const getCurrentOrder = (conv) => {
    let order;
    if (Object.keys(conv.data).findIndex((key) => key == 'order') != -1) {
        // there is pizza stored in conversation storage
        order = conv.data['order'];
    }
    else {
        order = [];
    }
    return order;
};
const getLatestSentOrder = (conv) => {
    return conv.user.storage['latestOrder'];
};
const saveSentOrder = (conv, order) => {
    conv.user.storage['latestOrder'] = order.order_id;
};
const savePizzaInOrder = (conv, pizza, size) => {
    let order;
    if (Object.keys(conv.data).findIndex((key) => key == 'order') != -1) {
        // there is pizza stored in conversation storage
        order = conv.data['order'];
    }
    else {
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
const mapAddress = ({ postalAddress, phoneNumber }) => {
    return {
        addressLines: postalAddress.addressLines,
        phone: phoneNumber,
        city: postalAddress.locality
    };
};
const getDeliveryAddress = (conv) => {
    return conv.data['deliveryAddress'];
};
const saveDeliveryAddress = (conv, address) => {
    conv.data['deliveryAddress'] = address;
};
const mockAddress = {
    addressLines: ['Chełmska', '6/8'],
    phone: '+48666777888',
    city: 'Warszawa'
};
function menuToListResponse(menu) {
    function pizzaToItem(pizza, index) {
        return {
            title: index + '. ' + pizza.name,
            synonyms: [index.toString()],
            description: 'Cena: ' + pizza.priceSmall + '. Składniki: ' + pizza.ingredients.join(', '),
            image: new actionssdk_1.Image({
                url: pizza.imageUrl,
                alt: 'Pizza Image'
            })
        };
    }
    let items = {};
    menu.items.forEach((pizza, index) => {
        const key = `PIZZA_${index + 1}`;
        items[key] = pizzaToItem(pizza, index + 1);
    });
    return new actions_on_google_1.List({
        title: 'Menu restauracji',
        items
    });
}
exports.default = ga;
//# sourceMappingURL=assistant.js.map