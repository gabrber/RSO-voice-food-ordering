import { MenuJSON, PizzaJSON } from "./data/interfaces";
import { MenuEntity, PizzaEntity } from "./data/entities";
import { MongoRepository } from "typeorm";

async function getCurrentMenu(repository: MongoRepository<MenuEntity>): Promise<MenuJSON> {
    const menus = await repository.find();
    if (menus.length == 0) {
        return Promise.reject('No menus stored in local database');
    }

    return toMenu(menus[0]);
}

async function addMenu(repository: MongoRepository<MenuEntity>, menu: MenuJSON): Promise<MenuJSON> {
    const entity = toMenuEntity(menu)
    const saved = await repository.save(entity)

    return toMenu(saved)
}

function toMenuEntity(menu: MenuJSON): MenuEntity {
    let entity = new MenuEntity()
    entity.items = menu.items.map((item) => toPizzaEntity(item))
    
    return entity;
}

function toPizzaEntity(pizza: PizzaJSON): PizzaEntity {
    let entity = Object.create(PizzaEntity.prototype)
    return Object.assign(entity, pizza, {})
}

function toMenu(entity: MenuEntity): MenuJSON {
    return {
        items: entity.items.map(toPizza)
    }
}

function toPizza(entity: PizzaEntity): PizzaJSON {
    return {
        name: entity.name,
        priceSmall: entity.priceSmall,
        priceBig: entity.priceBig,
        ingredients: entity.ingredients,
        imageUrl: entity.imageUrl
    }
}

export { addMenu, getCurrentMenu }