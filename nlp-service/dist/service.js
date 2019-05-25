"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("./data/entities");
async function getCurrentMenu(repository) {
    const menus = await repository.find();
    if (menus.length == 0) {
        return Promise.reject('No menus stored in local database');
    }
    return toMenu(menus[0]);
}
exports.getCurrentMenu = getCurrentMenu;
async function addMenu(repository, menu) {
    const entity = toMenuEntity(menu);
    const saved = await repository.save(entity);
    return toMenu(saved);
}
exports.addMenu = addMenu;
function toMenuEntity(menu) {
    let entity = new entities_1.MenuEntity();
    entity.items = menu.items.map((item) => toPizzaEntity(item));
    return entity;
}
function toPizzaEntity(pizza) {
    let entity = Object.create(entities_1.PizzaEntity.prototype);
    return Object.assign(entity, pizza, {});
}
function toMenu(entity) {
    return {
        items: entity.items.map(toPizza)
    };
}
function toPizza(entity) {
    return {
        name: entity.name,
        priceSmall: entity.priceSmall,
        priceBig: entity.priceBig,
        ingredients: entity.ingredients,
        imageUrl: entity.imageUrl
    };
}
//# sourceMappingURL=service.js.map