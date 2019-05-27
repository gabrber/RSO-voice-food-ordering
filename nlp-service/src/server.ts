import * as express from 'express';
import * as bodyParser from 'body-parser';
import ga from './assistant';
import { createConnection } from 'typeorm';
import { MenuEntity } from './data/entities';
import { synchronize } from './service_synchronize';
import * as https from 'https'
import { readFileSync } from 'fs';

async function bootstrap() {
	const conn = await createConnection({
		type: 'mongodb',
		host: process.env.MONGO_HOST,
		port: parseInt(process.env.MONGO_PORT),
		database: process.env.MONGO_DB,
		useNewUrlParser: true,
		entities: [ MenuEntity ],
		name: 'default'
	});
	const menuRepository = conn.getMongoRepository(MenuEntity);

	await synchronize(menuRepository);
	console.log('Local DB synchronized with remote');

	const app = express();
	app.use(bodyParser.json());

	app.post('/nlp', ga);

	const PORT = process.env.PORT || 5000;
	const HTTPS_PORT = process.env.PORT || 5001; 

	app.listen(PORT).on('listening', () => {
		console.log(`Server is running at: http://localhost:${PORT}`);
	});

	app.post('/update_menu', async (req, res) => {
		const menu = menuRepository.create(req.body);
		const saved = await menuRepository.save(menu);

		res.json(saved);
	});

	const httpsOptions = {
		key: readFileSync('./key.pem'),
		cert: readFileSync('./cert.pem')
	}
	https.createServer(httpsOptions, app).listen(HTTPS_PORT)
}

bootstrap();
