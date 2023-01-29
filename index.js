const express = require('express');
const app = express();
const connection = require('./database/connection');
const Game = require('./database/Game');

app.use(express.json());

connection.authenticate()
    .then(() => {
        console.log('Banco de dados conectado.');
    })
    .catch(err => {
        console.log(err);
    });

app.get('/games', async (req, res) => {
    try {
        let games = await Game.findAll();

        if (games) {
            res.json(games);
        } else {
            res.sendStatus(404);
        }
    } catch(err) {
        res.sendStatus(500);
    }
});

app.get('/games/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        try {
            let game = await Game.findByPk(id);

            if (game) {
                res.json(game);
            } else {
                res.sendStatus(404);
            }
        } catch(err) {
            res.sendStatus(500);
        }
    }
});

app.post('/games', (req, res) => {
    const {title, price, year} = req.body;

    if (title == undefined || price == undefined || year == undefined) {
        res.sendStatus(400);
    } else if (typeof title != 'string' || title == '') {
        res.sendStatus(400);
    } else if (typeof price != 'number' || price < 0) {
        res.sendStatus(400);
    } else if (typeof year != 'number' || year > new Date().getFullYear() || !Number.isInteger(year) || year < 1900) {
        res.sendStatus(400);
    } else {
        Game.create({ title, price: price.toFixed(2), year: year.toFixed(0) })
            .then(() => {
                res.sendStatus(200);
            });
    }

});

app.delete('/games/:id', (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        Game.destroy({
            where: { id }
        }).then(() => {
            res.sendStatus(200);
        });
    }
});

app.put('/games/:id', async (req, res) => {
    const id = req.params.id;
    let { title, price, year } = req.body;

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        let game = await Game.findByPk(id);

        if (game) {

            if (typeof title == 'string') {
                game.title = title;
            }

            if (typeof price == 'number' && price >= 0) {
                game.price = price.toFixed(2);
            }

            if (typeof year == 'number' && year > 1900 && Number.isInteger(year) && year <= new Date().getFullYear()) {
                game.year = year;
            }

            Game.update({ title: game.title, year: game.year, price: game.price }, {where: { id }}).then(() => {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(404);
        }
    }
});

app.listen(8787, () => {
    console.log('API running.');
});