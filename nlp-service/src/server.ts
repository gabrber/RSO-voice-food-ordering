import * as express from 'express';
import * as bodyParser from 'body-parser';
import ga from './assistant';
import { createConnection, getMongoRepository, Repository, getRepository } from 'typeorm';
import { addMenu } from './service';
import { MenuEntity, PizzaEntity } from './data/entities';

createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "rso_test",
    useNewUrlParser: true,
    entities: [MenuEntity ]
}).then(connection => {
    const menuRepository = getRepository(MenuEntity)

    const app = express()
    app.use(bodyParser.json())

    app.post('/nlp', ga)

    app.post('/update_menu', async (req, res) => {
        const menu = menuRepository.create(req.body)
        const saved = await menuRepository.save(menu)
        
        res.json(saved)
    })
    
    const PORT = process.env.NLP_PORT || 3000
    app.listen(PORT).on('listening', () => {
        console.log(`Server is running at: http://localhost:${PORT}`)
    })
})