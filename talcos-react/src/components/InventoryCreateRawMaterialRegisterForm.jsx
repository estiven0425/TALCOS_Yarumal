import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-raw-material-register-form.module.css";

function InventoryCreateRawMaterialRegister() {
  const [proveedor, setProveedor] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [titularRegistro, setTitularRegistro] = useState("");
  const [tipoRegistro, setTipoRegistro] = useState("");
  const [observacionRegistro, setObservacionRegistro] = useState("");
  const [registros, setRegistros] = useState([
    {
      proveedor: "",
      mpRegistro: "",
      valorMpRegistro: "",
      pesoMpRegistro: "",
      valorTRegistro: "",
      pesoNetoRegistro: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (data) {
      setTipoRegistro(data);
    }
  }, [data]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const getUsuario = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token: token,
        });

        setTitularRegistro(response.data.id_usuario);
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };
    getUsuario();
  }, [localIP]);

  useEffect(() => {
    const getSupplier = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/usuarios/registrousuario`
        );

        setProveedor(response.data);
      } catch (error) {
        console.error("Error al obtener los proveedores: ", error);
      }
    };

    getSupplier();
  }, [localIP]);

  useEffect(() => {
    const getRawMaterial = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/materias_primas`
        );

        setMateriaPrima(response.data);
      } catch (error) {
        console.error("Error al obtener las materias primas: ", error);
      }
    };

    getRawMaterial();
  }, [localIP]);

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventory/registerrawmaterial");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus]);

  const validation = () => {
    const errors = {};

    registros.forEach((registro, index) => {
      if (!registro.proveedor) {
        errors[`proveedor${index}`] = "El proveedor es obligatorio.";
      }
      if (!registro.mpRegistro) {
        errors[`mpRegistro${index}`] = "La materia prima es obligatoria.";
      }
      if (!registro.valorMpRegistro) {
        errors[`valorMpRegistro${index}`] =
          "El valor de la materia prima es obligatorio.";
      } else if (!/^[0-9]+$/.test(registro.valorMpRegistro)) {
        errors[`valorMpRegistro${index}`] =
          "El valor de la materia prima debe ser un número válido.";
      }

      if (!registro.pesoMpRegistro) {
        errors[`pesoMpRegistro${index}`] =
          "El peso de la materia prima es obligatorio.";
      } else if (!/^[0-9.,]+$/.test(registro.pesoMpRegistro)) {
        errors[`pesoMpRegistro${index}`] =
          "El peso de la materia prima debe ser un número válido.";
      }

      if (
        registro.valorTRegistro &&
        !/^[0-9]+$/.test(registro.valorTRegistro)
      ) {
        errors[`valorTRegistro${index}`] =
          "El valor del transporte debe ser un número válido.";
      }
      if (
        registro.pesoNetoRegistro &&
        !/^[0-9.,]+$/.test(registro.pesoNetoRegistro)
      ) {
        errors[`pesoNetoRegistro${index}`] =
          "El peso neto debe ser un número válido.";
      }
    });

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const addRegister = () => {
    setRegistros([
      ...registros,
      {
        proveedor: "",
        mpRegistro: "",
        valorMpRegistro: "",
        pesoMpRegistro: "",
        valorTRegistro: "",
        pesoNetoRegistro: "",
      },
    ]);
  };

  const handleRegistroChange = (index, field, value) => {
    const newRegistros = [...registros];

    newRegistros[index][field] = value;
    setRegistros(newRegistros);
  };

  const sendCreateRegister = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    const fechaRegistro = new Date().toISOString().split("T")[0];
    const horaRegistro = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const fullRecord = registros.map((registro) => ({
      fecha_registro: fechaRegistro,
      hora_registro: horaRegistro,
      titular_registro: titularRegistro,
      tipo_registro: tipoRegistro,
      observacion_registro: observacionRegistro,
      proveedor_registro: registro.proveedor,
      mp_registro: registro.mpRegistro,
      valor_mp_registro: registro.valorMpRegistro,
      valor_t_registro: registro.valorTRegistro,
      peso_mp_registro: registro.pesoMpRegistro,
      peso_neto_registro: registro.pesoNetoRegistro,
    }));

    try {
      await axios.post(`http://${localIP}:3000/registros`, {
        fullRecord: fullRecord,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al crear el registro. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateRawMaterialRegisterAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Registro creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateRawMaterialRegister}
          onSubmit={sendCreateRegister}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateRawMaterialRegisterHeader}>
            <h1>
              Complete los datos para crear un nuevo registro de{" "}
              {tipoRegistro === "Entrada" ? "entrada" : "salida"}
            </h1>
          </header>
          <main className={Style.inventoryCreateRawMaterialRegisterMain}>
            {registros.map((registro, index) => (
              <div key={index}>
                <fieldset
                  className={
                    Style.inventoryCreateRawMaterialRegisterMainEspecial
                  }
                >
                  <label htmlFor={`proveedor${index}`}>Proveedor</label>
                  <select
                    id={`proveedor${index}`}
                    name={`proveedor${index}`}
                    onChange={(e) =>
                      handleRegistroChange(index, "proveedor", e.target.value)
                    }
                    value={registro.proveedor}
                  >
                    <option value="">Selecciona un proveedor</option>
                    {proveedor.map((prov) => (
                      <option key={prov.id_usuario} value={prov.id_usuario}>
                        {prov.nombre_usuario}
                      </option>
                    ))}
                  </select>
                  {!validationError[`proveedor${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`proveedor${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={
                    Style.inventoryCreateRawMaterialRegisterMainEspecial
                  }
                >
                  <label htmlFor={`mpRegistro${index}`}>Materia Prima</label>
                  <select
                    id={`mpRegistro${index}`}
                    name={`mpRegistro${index}`}
                    onChange={(e) =>
                      handleRegistroChange(index, "mpRegistro", e.target.value)
                    }
                    value={registro.mpRegistro}
                  >
                    <option value="">Selecciona una materia prima</option>
                    {materiaPrima.map((mp) => (
                      <option
                        key={mp.nombre_materia_prima}
                        value={mp.nombre_materia_prima}
                      >
                        {mp.nombre_materia_prima}
                      </option>
                    ))}
                  </select>
                  {!validationError[`mpRegistro${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`mpRegistro${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor={`valorMpRegistro${index}`}>
                    Valor Materia Prima
                  </label>
                  <input
                    id={`valorMpRegistro${index}`}
                    name={`valorMpRegistro${index}`}
                    onChange={(e) =>
                      handleRegistroChange(
                        index,
                        "valorMpRegistro",
                        e.target.value
                      )
                    }
                    placeholder="Ingresa el valor de la materia prima"
                    type="text"
                    value={registro.valorMpRegistro}
                  />
                  {!validationError[`valorMpRegistro${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`valorMpRegistro${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor={`pesoMpRegistro${index}`}>
                    Peso Materia Prima
                  </label>
                  <input
                    id={`pesoMpRegistro${index}`}
                    name={`pesoMpRegistro${index}`}
                    onChange={(e) =>
                      handleRegistroChange(
                        index,
                        "pesoMpRegistro",
                        e.target.value
                      )
                    }
                    placeholder="Ingresa el peso de la materia prima"
                    type="text"
                    value={registro.pesoMpRegistro}
                  />
                  {!validationError[`pesoMpRegistro${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`pesoMpRegistro${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor={`valorTRegistro${index}`}>
                    Valor Transporte
                  </label>
                  <input
                    id={`valorTRegistro${index}`}
                    name={`valorTRegistro${index}`}
                    onChange={(e) =>
                      handleRegistroChange(
                        index,
                        "valorTRegistro",
                        e.target.value
                      )
                    }
                    placeholder="Ingresa el valor del transporte"
                    type="text"
                    value={registro.valorTRegistro}
                  />
                  {!validationError[`valorTRegistro${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`valorTRegistro${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor={`pesoNetoRegistro${index}`}>Peso Neto</label>
                  <input
                    id={`pesoNetoRegistro${index}`}
                    name={`pesoNetoRegistro${index}`}
                    onChange={(e) =>
                      handleRegistroChange(
                        index,
                        "pesoNetoRegistro",
                        e.target.value
                      )
                    }
                    placeholder="Ingresa el peso neto"
                    type="text"
                    value={registro.pesoNetoRegistro}
                  />
                  {!validationError[`pesoNetoRegistro${index}`] ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.inventoryCreateRawMaterialRegisterValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError[`pesoNetoRegistro${index}`]}
                    </motion.span>
                  )}
                </fieldset>
                <hr
                  className={
                    Style.inventoryCreateRawMaterialRegisterMainEspecial
                  }
                />
              </div>
            ))}
            <fieldset>
              <label htmlFor="observacionRegistro">Observación</label>
              <input
                id="observacionRegistro"
                name="observacionRegistro"
                onChange={(e) => setObservacionRegistro(e.target.value)}
                placeholder="Ingresa una observación"
                type="text"
                value={observacionRegistro}
              />
              {!validationError.observacionRegistro ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateRawMaterialRegisterValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.observacionRegistro}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.inventoryCreateRawMaterialRegisterFooter}>
            <button onClick={addRegister} type="button">
              Agregar Materia Prima
            </button>
            <button
              onClick={() => navigate("/inventory/registerrawmaterial")}
              type="button"
            >
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear Registro"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryCreateRawMaterialRegisterValidationServer
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.form>
      )}
    </>
  );
}

export default InventoryCreateRawMaterialRegister;
