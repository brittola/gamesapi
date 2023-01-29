const Sequelize = require('sequelize');
const connection = require('./connection');

const Game = connection.define('games', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
       type: Sequelize.INTEGER,
       allowNull: false 
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
});

Game.sync({ force: false }).then(() => {});

module.exports = Game;