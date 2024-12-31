const { sequelize } = require('../config/conectionDataBase');
const { DataTypes } = require('sequelize');

const Registros = sequelize.define(
    'registros',
    {
        id_registro: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        fecha_registro: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        titular_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        proveedor_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        mp_registro: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        valor_mp_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        valor_t_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        peso_mp_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        peso_neto_registro: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        observacion_registro: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        actualizacion_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'registros',
        timestamps: false,
    }
);

Registros.associate = (models) => {
    Registros.belongsTo(models.Usuarios, {
        foreignKey: 'titular_registro',
        targetKey: 'id_usuario',
    });
    Registros.belongsTo(models.Usuarios, {
        foreignKey: 'proveedor_registro',
        targetKey: 'id_usuario',
    });
};

module.exports = Registros;