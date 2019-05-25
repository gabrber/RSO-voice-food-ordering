"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const assistant_1 = require("./assistant");
const typeorm_1 = require("typeorm");
const entities_1 = require("./data/entities");
typeorm_1.createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "rso_test",
    useNewUrlParser: true,
    entities: [entities_1.MenuEntity, entities_1.PizzaEntity]
}).then(connection => {
    const menuRepository = connection.getMongoRepository(entities_1.MenuEntity);
    const app = express();
    app.use(bodyParser.json());
    app.post('/nlp', assistant_1.default);
    app.post('/update_menu', async (req, res) => {
        const menu = menuRepository.create(req.body);
        const saved = await menuRepository.save(menu);
        return saved;
    });
    app.listen(3000);
});
//# sourceMappingURL=server.js.map