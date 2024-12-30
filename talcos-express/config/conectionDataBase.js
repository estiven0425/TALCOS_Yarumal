const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('talcos_yarumal', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const conectionDataBase = async () => {
    try {
        await sequelize.authenticate();

        console.log('MySQL conectado');
    } catch (error) {
        console.error('Imposible conectar a la base de datos. Error: ', error);
    }
};

module.exports = { sequelize, conectionDataBase };
