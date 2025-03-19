import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-raw-material-register-form.module.css";

function InventoryCreateRawMaterialRegister() {
  const [proveedor, setProveedor] = useState([]);
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [transportador, setTransportador] = useState([]);
  const [titularRegistro, setTitularRegistro] = useState("");
  const [remisionRegistro, setRemisionRegistro] = useState("");
  const [nombreProveedorRegistro, setNombreProveedorRegistro] = useState("");
  const [documentoProveedorRegistro, setDocumentoProveedorRegistro] =
    useState("");
  const [nombreTransportadorRegistro, setNombreTransportadorRegistro] =
    useState("");
  const [documentoTransportadorRegistro, setDocumentoTransportadorRegistro] =
    useState("");
  const [tipoRegistro, setTipoRegistro] = useState("");
  const [mpRegistro, setMpRegistro] = useState("");
  const [valorMpRegistro, setValorMpRegistro] = useState("");
  const [pesoMpRegistro, setPesoMpRegistro] = useState("");
  const [conceptoRegistro, setConceptoRegistro] = useState("");
  const [zonaRegistro, setZonaRegistro] = useState("");
  const [bonificacionRegistro, setBonificacionRegistro] = useState("");
  const [valorTRegistro, setValorTRegistro] = useState("");
  const [observacionRegistro, setObservacionRegistro] = useState("");
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
    const getConveyor = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/usuarios/registrotransportador`
        );

        setTransportador(response.data);
      } catch (error) {
        console.error("Error al obtener los transportadores: ", error);
      }
    };

    getConveyor();
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

    if (!remisionRegistro) {
      errors.remisionRegistro = "La remisión del registro es obligatoria.";
    } else if (!/^[0-9]+$/.test(remisionRegistro)) {
      errors.remisionRegistro =
        "La remisión del registro debe ser un número válido.";
    }
    if (!nombreTransportadorRegistro) {
      errors.proveedorRegistro = "El proveedor es obligatorio.";
    }
    if (!nombreTransportadorRegistro) {
      errors.transportadorRegistro = "El transportador es obligatorio.";
    }
    if (!mpRegistro) {
      errors.mpRegistro = "La materia prima es obligatoria.";
    }
    if (!valorMpRegistro) {
      errors.valorMpRegistro = "El valor de la materia prima es obligatorio.";
    } else if (!/^[0-9]+$/.test(valorMpRegistro)) {
      errors.valorMpRegistro =
        "El valor de la materia prima debe ser un número válido.";
    }
    if (!pesoMpRegistro) {
      errors.pesoMpRegistro = "El peso de la materia prima es obligatorio.";
    } else if (!/^[0-9.,]+$/.test(pesoMpRegistro)) {
      errors.pesoMpRegistro =
        "El peso de la materia prima debe ser un número válido.";
    }
    if (!conceptoRegistro) {
      errors.conceptoRegistro = "El valor del concepto es obligatorio.";
    } else if (!/^[0-9]+$/.test(conceptoRegistro)) {
      errors.conceptoRegistro =
        "El valor del concepto debe ser un número válido.";
    }
    if (!zonaRegistro) {
      errors.zonaRegistro = "El valor de la zona prima es obligatorio.";
    }
    if (!bonificacionRegistro) {
      errors.bonificacionRegistro =
        "El valor de la bonificacion por tonelada es obligatorio.";
    } else if (!/^[0-9.,]+$/.test(bonificacionRegistro)) {
      errors.bonificacionRegistro =
        "El valor de la bonificacion por tonelada debe ser un número válido.";
    }
    if (!valorTRegistro) {
      errors.valorTRegistro = "El valor del transporte es obligatorio.";
    } else if (!/^[0-9]+$/.test(valorTRegistro)) {
      errors.valorTRegistro =
        "El valor del transporte debe ser un número válido.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
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
    const monthRegistro = new Date().getMonth() + 1;
    const fullRecord = {
      fecha_registro: fechaRegistro,
      hora_registro: horaRegistro,
      mes_registro: monthRegistro,
      titular_registro: titularRegistro,
      remision_registro: remisionRegistro,
      nombre_proveedor_registro: nombreProveedorRegistro,
      documento_proveedor_registro: documentoProveedorRegistro,
      nombre_transportador_registro: nombreTransportadorRegistro,
      documento_transportador_registro: documentoTransportadorRegistro,
      tipo_registro: tipoRegistro,
      mp_registro: mpRegistro,
      valor_mp_registro: valorMpRegistro,
      peso_mp_registro: pesoMpRegistro,
      concepto_registro: conceptoRegistro,
      zona_registro: zonaRegistro,
      bonificacion_registro: bonificacionRegistro,
      valor_t_registro: valorTRegistro,
      observacion_registro: observacionRegistro,
    };

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
      ) : data === "Registro manual" ? (
        <motion.form
          className={Style.inventoryCreateRawMaterialRegister}
          onSubmit={sendCreateRegister}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateRawMaterialRegisterHeader}>
            <h1>Complete los datos para crear un nuevo registro de entrada</h1>
          </header>
          <main className={Style.inventoryCreateRawMaterialRegisterMain}>
            <div>
              <fieldset
                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
              >
                <label htmlFor="remisionRegistro">Remisión</label>
                <input
                  id="remisionRegistro"
                  name="remisionRegistro"
                  onChange={(e) => setRemisionRegistro(e.target.value)}
                  placeholder="Ingresa la remisión del registro"
                  type="text"
                  value={remisionRegistro}
                />
                {!validationError.remisionRegistro ? (
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
                    {validationError.remisionRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="proveedorRegistro">Proveedor</label>
                <select
                  id="proveedorRegistro"
                  name="proveedorRegistro"
                  onChange={(e) => {
                    const selected = JSON.parse(e.target.value);

                    setNombreProveedorRegistro(selected.nombre_usuario);
                    setDocumentoProveedorRegistro(selected.documento_usuario);
                  }}
                  value={
                    nombreProveedorRegistro
                      ? JSON.stringify(
                          proveedor.find(
                            (proveedor) =>
                              proveedor.nombre_usuario ===
                              nombreProveedorRegistro
                          )
                        )
                      : ""
                  }
                >
                  <option value="" disabled>
                    Selecciona un proveedor
                  </option>
                  {proveedor.map((proveedor) => (
                    <option
                      key={proveedor.id_usuario}
                      value={JSON.stringify(proveedor)}
                    >
                      {proveedor.nombre_usuario}
                    </option>
                  ))}
                </select>
                {!validationError.proveedorRegistro ? (
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
                    {validationError.proveedorRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="transportadorRegistro">Transportador</label>
                <select
                  id="transportadorRegistro"
                  name="transportadorRegistro"
                  onChange={(e) => {
                    const selected = JSON.parse(e.target.value);

                    setNombreTransportadorRegistro(selected.nombre_usuario);
                    setDocumentoTransportadorRegistro(
                      selected.documento_usuario
                    );
                  }}
                  value={
                    nombreTransportadorRegistro
                      ? JSON.stringify(
                          transportador.find(
                            (transportador) =>
                              transportador.nombre_usuario ===
                              nombreTransportadorRegistro
                          )
                        )
                      : ""
                  }
                >
                  <option value="" disabled>
                    Selecciona un transportador
                  </option>
                  {transportador.map((transportador) => (
                    <option
                      key={transportador.id_usuario}
                      value={JSON.stringify(transportador)}
                    >
                      {transportador.nombre_usuario}
                    </option>
                  ))}
                </select>
                {!validationError.transportadorRegistro ? (
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
                    {validationError.transportadorRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
              >
                <label htmlFor="mpRegistro">Materia Prima</label>
                <select
                  id="mpRegistro"
                  name="mpRegistro"
                  onChange={(e) => setMpRegistro(e.target.value)}
                  value={mpRegistro}
                >
                  <option value="" disabled>
                    Selecciona una materia prima
                  </option>
                  {materiaPrima.map((mp) => (
                    <option
                      key={mp.nombre_materia_prima}
                      value={mp.nombre_materia_prima}
                    >
                      {mp.nombre_materia_prima}
                    </option>
                  ))}
                </select>
                {!validationError.mpRegistro ? (
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
                    {validationError.mpRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="valorMpRegistro">Valor Materia Prima</label>
                <input
                  id="valorMpRegistro"
                  name="valorMpRegistro"
                  onChange={(e) => setValorMpRegistro(e.target.value)}
                  placeholder="Ingresa el valor de la materia prima"
                  type="text"
                  value={valorMpRegistro}
                />
                {!validationError.valorMpRegistro ? (
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
                    {validationError.valorMpRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="pesoMpRegistro">Peso Materia Prima</label>
                <input
                  id="pesoMpRegistro"
                  name="pesoMpRegistro"
                  onChange={(e) => setPesoMpRegistro(e.target.value)}
                  placeholder="Ingresa el peso de la materia prima"
                  type="text"
                  value={pesoMpRegistro}
                />
                {!validationError.pesoMpRegistro ? (
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
                    {validationError.pesoMpRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="conceptoRegistro">Concepto</label>
                <input
                  id="conceptoRegistro"
                  name="conceptoRegistro"
                  onChange={(e) => setConceptoRegistro(e.target.value)}
                  placeholder="Ingresa el concepto del registro"
                  type="text"
                  value={conceptoRegistro}
                />
                {!validationError.conceptoRegistro ? (
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
                    {validationError.conceptoRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="zonaRegistro">Zona</label>
                <input
                  id="zonaRegistro"
                  name="zonaRegistro"
                  onChange={(e) => setZonaRegistro(e.target.value)}
                  placeholder="Ingresa la zona del registro"
                  type="text"
                  value={zonaRegistro}
                />
                {!validationError.zonaRegistro ? (
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
                    {validationError.zonaRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
              >
                <label htmlFor="bonificacionRegistro">
                  Bonificación por tonelada
                </label>
                <input
                  id="bonificacionRegistro"
                  name="bonificacionRegistro"
                  onChange={(e) => setBonificacionRegistro(e.target.value)}
                  placeholder="Ingresa la bonificación por tonelada del registro"
                  type="text"
                  value={bonificacionRegistro}
                />
                {!validationError.bonificacionRegistro ? (
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
                    {validationError.bonificacionRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
              >
                <label htmlFor="valorTRegistro">Valor Transporte</label>
                <input
                  id="valorTRegistro"
                  name="valorTRegistro"
                  onChange={(e) => setValorTRegistro(e.target.value)}
                  placeholder="Ingresa el valor del transporte"
                  type="text"
                  value={valorTRegistro}
                />
                {!validationError.valorTRegistro ? (
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
                    {validationError.valorTRegistro}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
              >
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
                    className={
                      Style.inventoryCreateRawMaterialRegisterValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.observacionRegistro}
                  </motion.span>
                )}
              </fieldset>
            </div>
          </main>
          <footer className={Style.inventoryCreateRawMaterialRegisterFooter}>
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
      ) : (
        <> </>
      )}
    </>
  );
}

export default InventoryCreateRawMaterialRegister;
