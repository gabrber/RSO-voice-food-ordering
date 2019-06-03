import { PizzaJSON } from './data/interfaces';
import { MenuEntity } from './data/entities';
import { MongoRepository } from 'typeorm';

async function getLocalMenu(repository: MongoRepository<MenuEntity>): Promise<MenuEntity> {
	const menus = await repository.find()
	if (menus.length == 0) {
		return Promise.reject('No menus stored in local database');
	}

	return menus[menus.length - 1];
}

async function addMenu(repository: MongoRepository<MenuEntity>, menu: PizzaJSON[]): Promise<MenuEntity> {
	const entity = toMenuEntity(menu);
	
	const savedMenu = await repository.save(entity);
	console.log(`addMenu: ${savedMenu.id}`)

	return savedMenu
}

function toMenuEntity(menu: PizzaJSON[]): MenuEntity {
	let entity = new MenuEntity();
	// entity.remoteId = menu.menu_id;
	entity.items = menu.map((item) => {
		return {
			name: item.name,
			priceSmall: item.price_small,
			priceBig: item.price_big,
			ingredients: item.ingredients.split(','),
			imageUrl: item.pizza_img
		};
	});

	return entity;
}

export { addMenu, getLocalMenu as getCurrentMenu };
