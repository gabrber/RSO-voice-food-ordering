"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_on_google_1 = require("actions-on-google");
const assistant = actions_on_google_1.dialogflow();
assistant.intent('Default Welcome Intent', conv => {
    // conv.ask('Cześć. Tu aplikacja zamów pizzę!')
    conv.ask('Czy chcesz poznać nasze menu czy zamówić pizzę?');
    conv.contexts.set('init-decision', 1);
});
assistant.intent('want-order-pizza', conv => {
    conv.ask('Jaką pizzę chcesz zamówić?');
    conv.contexts.set('order', 5);
});
assistant.intent('order-named-pizza', (conv, params) => {
    let name = params['pizza-name'];
    let amount = params['pizza-amount'];
    let size = params['pizza-size'];
    if (name == null) {
        conv.ask('Nie podałeś dostępnej nazwy pizzy. Jaką pizzę chcesz zamówić?');
    }
    else {
        amount = amount == null || amount == '' ? 1 : amount;
        size = size == null || size == '' ? 'normal' : size;
        console.log(``);
        conv.ask(`Twoje zamówienie to: ${amount} razy ${size} ${name}`);
    }
});
assistant.intent('delivery-address-complete', conv => {
    const arg = conv.arguments.get('DELIVERY_ADDRESS_VALUE');
    if (arg.userDecision === 'ACCEPTED') {
        console.log('DELIVERY_ADDRESS: ' + arg.location);
        conv.data['deliveryAddress'] = arg.location;
        conv.ask('Super. Mam twój adres. Czy potwierdzasz zamówienie?');
    }
    else {
        conv.close('Bez twojego adresu nie mogę zrealizować zamówienia. Cześć');
    }
});
function askForAddress(conv) {
    conv.ask(new actions_on_google_1.DeliveryAddress({
        addressOptions: {
            reason: 'Aby dowieźć twoje zamówienie'
        }
    }));
}
exports.default = assistant;
//# sourceMappingURL=assistant.js.map