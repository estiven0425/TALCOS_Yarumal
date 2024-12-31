const { sequelize } = require('../config/conectionDataBase');
const { DataTypes } = require('sequelize');

const Mensajes = sequelize.define(
    'mensajes',
    {
        id_mensaje: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        fecha_mensaje: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        hora_mensaje: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        texto_mensaje: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        emisor_mensaje: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        receptor_mensaje: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        actualizacion_mensaje: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'mensajes',
        timestamps: false,
    }
);

Mensajes.associate = (models) => {
    Mensajes.belongsTo(models.Usuarios, {
        foreignKey: 'emisor_mensaje',
        targetKey: 'id_usuario',
    });
    Mensajes.belongsTo(models.Usuarios, {
        foreignKey: 'receptor_mensaje',
        targetKey: 'id_usuario',
    });
};

module.exports = Mensajes;