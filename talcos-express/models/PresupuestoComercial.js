const { sequelize } = require("../config/conectionDataBase");

const { DataTypes } = require("sequelize");

const PresupuestoComercial = sequelize.define(
  "presupuesto_comercial",
  {
    id_presupuesto_comercial: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_presupuesto_comercial: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    capacidad_presupuesto_comercial: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    actividad_presupuesto_comercial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    actualizacion_presupuesto_comercial: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "presupuesto_comercial",
    timestamps: false,
  },
);

module.exports = PresupuestoComercial;
