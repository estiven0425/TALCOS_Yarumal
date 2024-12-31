const { sequelize } = require('../config/conectionDataBase');
const { DataTypes } = require('sequelize');

const InformeInicial = sequelize.define(
    'informe_inicial',
    {
        id_informe_inicial: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        titular_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        fecha_informe_inicial: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        hora_informe_inicial: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        turno_informe_inicial: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        bob_cat_informe_inicial: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        molino_informe_inicial: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        referencia_informe_inicial: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        bulto_informe_inicial: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        horometro_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        operador_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        carguero_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        mecanico_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        cdc_informe_inicial: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        observacion_informe_inicial: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            defaultValue: 'No se registró',
        },
        actividad_informe_inicial: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        actualizacion_informe_inicial: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'informe_inicial',
        timestamps: false,
    }
);

InformeInicial.associate = (models) => {
    InformeInicial.belongsTo(models.Usuarios, {
        foreignKey: 'titular_informe_inicial',
        targetKey: 'id_usuario',
    });
    InformeInicial.belongsTo(models.Usuarios, {
        foreignKey: 'operador_informe_inicial',
        targetKey: 'id_usuario',
    });
    InformeInicial.belongsTo(models.Usuarios, {
        foreignKey: 'carguero_informe_inicial',
        targetKey: 'id_usuario',
    });
    InformeInicial.belongsTo(models.Usuarios, {
        foreignKey: 'mecanico_informe_inicial',
        targetKey: 'id_usuario',
    });
    InformeInicial.belongsTo(models.Usuarios, {
        foreignKey: 'cdc_informe_inicial',
        targetKey: 'id_usuario',
    });
};

module.exports = InformeInicial;