const { sequelize } = require("../config/conectionDataBase");
const { DataTypes } = require("sequelize");

const BobCats = sequelize.define(
  "bob_cats",
  {
    id_bob_cat: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_bob_cat: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    actividad_bob_cat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    actualizacion_bob_cat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bob_cats",
    timestamps: false,
  }
);

module.exports = BobCats;
