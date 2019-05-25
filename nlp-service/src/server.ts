import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as https from 'https';
import ga from './assistant';
import { createConnection, getMongoRepository, Repository, getRepository } from 'typeorm';
import { addMenu } from './service';
import { MenuEntity, PizzaEntity } from './data/entities';
import { readFileSync } from 'fs';

// createConnection({
//     type: "mongodb",
//     host: "localhost",
//     port: 27017,
//     database: "rso_test",
//     useNewUrlParser: true,
//     entities: [MenuEntity ]
// }).then(connection => {
//     const menuRepository = getRepository(MenuEntity)

//     const app = express()
//     app.use(bodyParser.json())

//     app.post('/nlp', ga)

//     app.post('/update_menu', async (req, res) => {
//         const menu = menuRepository.create(req.body)
//         const saved = await menuRepository.save(menu)

//         res.json(saved)
//     })

//     const PORT = process.env.NLP_PORT || 3000
//     app.listen(PORT).on('listening', () => {
//         console.log(`Server is running at: http://localhost:${PORT}`)
//     })
// })

function bootstrap() {
	const key = readFileSync('./sslcert/server.key', 'utf8');
	const cert = readFileSync('./sslcert/server.cert', 'utf8');

	const credentials = { key, cert };

	const app = express();
	app.use(bodyParser.json());

	app.post('/nlp', ga);

	// app.listen(3000).on('listening', () => {
	// 	console.log(`Server is running at: http://localhost:${PORT}`);
	// });
	// http.createServer(app).listen(3000).on('listening', () => {
	// 	// 	console.log(`Server is running at: http://localhost:${PORT}`);
	// 	console.log('Server is running on port 3000');
	// });

	https.createServer(credentials, app).listen(5000).on('listening', () => {
		console.log('Server is running on port 5000');
	});
}

bootstrap();
