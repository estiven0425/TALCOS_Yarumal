const { sequelize } = require("../config/conectionDataBase");
const { DataTypes } = require("sequelize");
const Usuarios = require("./Usuarios");

const Registros = sequelize.define(
  "registros",
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
    hora_registro: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    titular_registro: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    proveedor_registro: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    tipo_registro: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    mp_registro: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    valor_mp_registro: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    valor_t_registro: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    peso_mp_registro: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    peso_neto_registro: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    observacion_registro: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "No se registró",
    },
    actualizacion_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "registros",
    timestamps: false,
  }
);

Registros.belongsTo(Usuarios, {
  foreignKey: "titular_registro",
  targetKey: "id_usuario",
  as: "titular",
});
Registros.belongsTo(Usuarios, {
  foreignKey: "proveedor_registro",
  targetKey: "id_usuario",
  as: "proveedor",
});

module.exports = Registros;
