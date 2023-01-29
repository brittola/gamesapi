const Sequelize = require('sequelize');

const connection = new Sequelize('games_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;