const { sequelize } = require('../config/conectionDataBase');
const { DataTypes } = require('sequelize');

const Referencias = sequelize.define(
    'referencias',
    {
        id_referencia: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        nombre_referencia: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        cantidad_referencia: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        cliente_referencia: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No registrado',
        },
        actividad_referencia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        actualizacion_referencia: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'referencias',
        timestamps: false,
    }
);

module.exports = Referencias;
