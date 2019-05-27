"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const assistant_1 = require("./assistant");
const typeorm_1 = require("typeorm");
const entities_1 = require("./data/entities");
const fs_1 = require("fs");
const service_synchronize_1 = require("./service_synchronize");
const util_1 = require("util");
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
    const key = fs_1.readFileSync('./sslcert/server.key', 'utf8');
    const cert = fs_1.readFileSync('./sslcert/server.cert', 'utf8');
    const credentials = { key, cert };
    const app = express();
    app.use(bodyParser.json());
    app.post('/nlp', assistant_1.default);
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
async function heroku() {
    const conn = await typeorm_1.createConnection({
        type: 'mongodb',
        host: process.env.MONGO_HOST,
        port: parseInt(process.env.MONGO_PORT),
        database: process.env.MONGO_DB,
        useNewUrlParser: true,
        entities: [entities_1.MenuEntity],
        name: 'default'
    });
    const menuRepository = conn.getMongoRepository(entities_1.MenuEntity);
    await service_synchronize_1.synchronize(menuRepository);
    util_1.print('Local DB synchronized with remote');
    const app = express();
    app.use(bodyParser.json());
    app.post('/nlp', assistant_1.default);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT).on('listening', () => {
        console.log(`Server is running at: http://localhost:${PORT}`);
    });
    app.post('/update_menu', async (req, res) => {
        const menu = menuRepository.create(req.body);
        const saved = await menuRepository.save(menu);
        res.json(saved);
    });
}
// bootstrap();
heroku();
//# sourceMappingURL=server.js.map