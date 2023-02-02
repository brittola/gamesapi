const express = require('express');
const app = express();
const connection = require('./database/connection');
const Game = require('./database/Game');
const User = require('./database/User');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middlewares/auth');

const JWT_SECRET = require('./JWT/JWT_SECRET');

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// Database
connection.authenticate()
    .then(() => {
        console.log('Banco de dados conectado.');
    })
    .catch(err => {
        console.log(err);
    });

// Routes
app.get('/games', async (req, res) => {
    const HATEOAS = [
        {
            href: "http://localhost:8787/games/0",
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:8787/games/0",
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:8787/games/",
            method: "POST",
            rel: "create_game"
        },
        {
            href: "http://localhost:8787/games/0",
            method: "PUT",
            rel: "edit_game"
        },
        {
            href: "http://localhost:8787/auth",
            method: "POST",
            rel: "auth_user"
        }
    ];

    try {
        let games = await Game.findAll();

        if (games) {
            res.json({games, _links: HATEOAS});
        } else {
            res.sendStatus(404);
        }
    } catch(err) {
        res.sendStatus(500);
    }
});

app.get('/games/:id', async (req, res) => {
    const id = req.params.id;

    const HATEOAS = [
        {
            href: "http://localhost:8787/games/" + id,
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:8787/games/" + id,
            method: "PUT",
            rel: "edit_game"
        },
		{
            href: "http://localhost:8787/games/",
            method: "GET",
            rel: "get_all_games"
        },
        {
            href: "http://localhost:8787/games/",
            method: "POST",
            rel: "create_game"
        },
        {
            href: "http://localhost:8787/auth",
            method: "POST",
            rel: "auth_user"
        }
    ];

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        try {
            let game = await Game.findByPk(id);

            if (game) {
                res.json({game, _links: HATEOAS});
            } else {
                res.sendStatus(404);
            }
        } catch(err) {
            res.sendStatus(500);
        }
    }
});

app.post('/games', auth, (req, res) => {
    const {title, price, year} = req.body;

    const HATEOAS = [
        {
            href: "http://localhost:8787/games",
            method: "GET",
            rel: "get_all_games"
        },
        {
            href: "http://localhost:8787/games/0",
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:8787/games/0",
            method: "PUT",
            rel: "edit_game"
        },
        {
            href: "http://localhost:8787/games/0",
            method: "DELETE",
            rel: "delete_game"
        }
    ];

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
                res.status(200);
                res.json({_links: HATEOAS});
            });
    }

});

app.delete('/games/:id', auth, (req, res) => {
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

app.put('/games/:id', auth, async (req, res) => {
    const id = req.params.id;
    let { title, price, year } = req.body;

    const HATEOAS = [
        {
            href: "http://localhost:8787/games",
            method: "GET",
            rel: "get_all_games"
        },
        {
            href: "http://localhost:8787/games/" + id,
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:8787/games/",
            method: "POST",
            rel: "create_game"
        },
        {
            href: "http://localhost:8787/games/" + id,
            method: "DELETE",
            rel: "delete_game"
        },
    ];

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
                res.status(200);
                res.json({_links: HATEOAS})
            });
        } else {
            res.sendStatus(404);
        }
    }
});

// Login
app.post('/auth', (req, res) => {
    const {email, password} = req.body;

    const HATEOAS = [
        {
            href: "http://localhost:8787/user",
            method: "POST",
            rel: "create_user"
        }
    ];

    if (email && password) {
        User.findOne({where: {email}}).then(user => {
            if (user) {
                let confirm = bcrypt.compareSync(password, user.password);

                if (confirm) {
                    jwt.sign({id: user.id, email}, JWT_SECRET, {expiresIn: '48h'}, (err, token) => {
                        if (err) {
                            res.status(500);
                            res.json({err: "Falha interna"});
                        } else {
                            res.status(200);
                            res.json({token, _links: HATEOAS});
                        }
                    });
                } else {
                    res.status(401);
                    res.json({err: "E-mail ou senha inválidos"});
                }
            } else {
                res.status(404);
                res.json({err: "Usuário não encontrado."});
            }
        });
    } else {
        res.status(400);
        res.json({err: "E-mail ou senha inválidos."});
    }
});

app.post('/user', async (req, res) => {
    const {email, password} = req.body;

    if (email && password) {
        let salt = bcrypt.genSaltSync(10);

        User.findOne({where: {email}}).then(user => {
            if (user) {
                res.status(400);
                res.json({err: "E-mail já cadastrado."});
            } else {
                User.create({
                    email,
                    password: bcrypt.hashSync(password, salt)
                }).then(() => {
                    res.sendStatus(200);
                });
            }
        });

    } else {
        res.status(400);
        res.json({err: "E-mail ou senha inválida para criação de usuário."});
    }
});

app.listen(8787, () => {
    console.log('API running.');
});