const { sequelize } = require("../config/conectionDataBase");

const { DataTypes } = require("sequelize");

const Paros = sequelize.define(
  "paros",
  {
    id_paro: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_paro: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    actividad_paro: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    actualizacion_paro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "paros",
    timestamps: false,
  },
);

module.exports = Paros;
