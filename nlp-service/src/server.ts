import * as express from 'express';
import * as bodyParser from 'body-parser';
import ga from './assistant';
import { createConnection } from 'typeorm';
import { MenuEntity } from './data/entities';
import { synchronize } from './service_synchronize';
import { PizzaJSON } from './data/interfaces';
import { addMenu } from './service_local';
import * as morgan from 'morgan'

async function bootstrap() {
	createConnection({
		type: 'mongodb',
		host: process.env.MONGO_HOST,
		port: parseInt(process.env.MONGO_PORT),
		database: process.env.MONGO_DB,
		username: process.env.MONGO_USERNAME,
		password: process.env.MONGO_PASSWORD,
		useNewUrlParser: true,
		entities: [ MenuEntity ],
		name: 'default'
	}).then(async conn => {
		const menuRepository = conn.getMongoRepository(MenuEntity);

		await synchronize(menuRepository)
		console.log('Local DB synchronized with remote');
	
		const app = express();
		app.use(morgan('combined'))
		app.use(bodyParser.json());
	
		app.post('/nlp', ga);
	
		const PORT = process.env.PORT || 3000;
	
		app.listen(PORT).on('listening', () => {
			console.log(`Server is running at: http://localhost:${PORT}`);
		});
	
		app.post('/update_menu', async (req, res) => {
			const pizzas: PizzaJSON[] = req.body;
			addMenu(menuRepository, pizzas);
	
			res.sendStatus(200)
		});
	})
}

bootstrap();
