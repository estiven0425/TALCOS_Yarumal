const { sequelize } = require("../config/conectionDataBase");
const { DataTypes } = require("sequelize");

const Despachos = sequelize.define(
  "despachos",
  {
    id_despachos: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_despachos: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    cantidad_despachos: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    actividad_despachos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    actualizacion_despachos: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "despachos",
    timestamps: false,
  }
);

module.exports = Despachos;
