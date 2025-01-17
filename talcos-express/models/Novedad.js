const { sequelize } = require('../config/conectionDataBase');
const { DataTypes } = require('sequelize');
const Usuarios = require('./Usuarios');

const Novedad = sequelize.define(
    'novedad',
    {
        id_novedad: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        fecha_novedad: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        hora_novedad: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        turno_novedad: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        tipo_novedad: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        molino_novedad: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        referencia_novedad: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        bulto_novedad: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        operador_novedad: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id_usuario',
            }
        },
        bob_cat_novedad: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        carguero_novedad: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id_usuario',
            }
        },
        mecanico_novedad: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id_usuario',
            }
        },
        inicio_paro_novedad: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        fin_paro_novedad: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        horometro_inicio_paro_novedad: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        horometro_fin_paro_novedad: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        motivo_paro_novedad: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        observacion_novedad: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        actividad_novedad: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        actualizacion_novedad: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'novedad',
        timestamps: false,
    }
);

Novedad.belongsTo(Usuarios, {
    foreignKey: 'operador_novedad',
    targetKey: 'id_usuario',
    as: 'operador'
});
Novedad.belongsTo(Usuarios, {
    foreignKey: 'carguero_novedad',
    targetKey: 'id_usuario',
    as: 'carguero'
});
Novedad.belongsTo(Usuarios, {
    foreignKey: 'mecanico_novedad',
    targetKey: 'id_usuario',
    as: 'mecanico'
});

module.exports = Novedad;