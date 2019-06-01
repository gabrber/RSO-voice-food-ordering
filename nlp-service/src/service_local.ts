import { PizzaJSON } from './data/interfaces';
import { MenuEntity } from './data/entities';
import { MongoRepository } from 'typeorm';

async function getLocalMenu(repository: MongoRepository<MenuEntity>): Promise<MenuEntity> {
	const menus = await repository.find();
	if (menus.length == 0) {
		return Promise.reject('No menus stored in local database');
	}

	return menus[0];
}

async function addMenu(repository: MongoRepository<MenuEntity>, menu: PizzaJSON[]): Promise<MenuEntity> {
    const entity = toMenuEntity(menu);

    // const storedMenu = await repository.findOne({ remoteId: menu.menu_id });
    // if (storedMenu) {
    //     return storedMenu;
    // } else {
        return repository.save(entity);
    // }
}

function toMenuEntity(menu: PizzaJSON[]): MenuEntity {
	let entity = new MenuEntity();
	// entity.remoteId = menu.menu_id;
	entity.items = menu.map((item) => {
		return {
			name: item.name,
			priceSmall: item.price_small,
			priceBig: item.price_big,
			ingredients: item.ingredients,
			imageUrl: item.image_url
		};
	});

	return entity;
}

export { addMenu, getLocalMenu as getCurrentMenu };
