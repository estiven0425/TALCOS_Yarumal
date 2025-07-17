const { sequelize } = require("../config/conectionDataBase");
const { DataTypes } = require("sequelize");

const Bultos = sequelize.define(
  "bultos",
  {
    id_bulto: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_bulto: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    capacidad_bulto: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    actividad_bulto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    actualizacion_bulto: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bultos",
    timestamps: false,
  },
);

module.exports = Bultos;
