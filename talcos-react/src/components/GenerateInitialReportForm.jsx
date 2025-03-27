import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-initial-report-form.module.css";

function GenerateInitialReportForm() {
  const [currentShift, setCurrentShift] = useState(null);
  const [controlCalidad, setControlCalidad] = useState([]);
  const [mecanico, setMecanico] = useState([]);
  const [operador, setOperador] = useState([]);
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [bulto, setBulto] = useState([]);
  const [carguero, setCarguero] = useState([]);
  const [bobCat, setBobCat] = useState([]);
  const [titularInformeInicial, setTitularInformeInicial] = useState("");
  const [controlCalidadInformeInicial, setControlCalidadInformeInicial] =
    useState([]);
  const [mecanicoInformeInicial, setMecanicoInformeInicial] = useState([]);
  const [operadorInformeInicial, setOperadorInformeInicial] = useState([]);
  const [molinoInformeInicial, setMolinoInformeInicial] = useState([]);
  const [referenciaInformeInicial, setReferenciaInformeInicial] = useState([]);
  const [bultoInformeInicial, setBultoInformeInicial] = useState([]);
  const [horometroInformeInicial, setHorometroInformeInicial] = useState([]);
  const [cargueroInformeInicial, setCargueroInformeInicial] = useState([]);
  const [bobCatInformeInicial, setBobCatInformeInicial] = useState([]);
  const [observacionInformeInicial, setObservacionInformeInicial] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/generatereportmenu");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const getUsuario = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token: token,
        });

        setTitularInformeInicial(response.data.id_usuario);
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };
    getUsuario();
  }, [localIP]);
  useEffect(() => {
    const getShifts = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = response.data;
        const currentTime = new Date();

        const compareTime = (hour, start, end) => {
          const [startTime, startMinute] = start.split(":").map(Number);
          const [endTime, endMinute] = end.split(":").map(Number);
          const startTimeMs = (startTime * 60 + startMinute) * 60000;
          const endTimeMs = (endTime * 60 + endMinute) * 60000;
          const currentTimeMs =
            (hour.getHours() * 60 + hour.getMinutes()) * 60000;

          if (endTimeMs > startTimeMs) {
            return currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs;
          } else {
            return currentTimeMs >= startTimeMs || currentTimeMs < endTimeMs;
          }
        };

        const currentShift = shifts.find((shift) =>
          compareTime(currentTime, shift.inicio_turno, shift.fin_turno)
        );

        currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
        currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);

        setCurrentShift(currentShift);
      } catch (error) {
        console.error("Error al obtener el turno:", error);
      }
    };

    getShifts();
  }, [localIP]);
  useEffect(() => {
    const getItems = async () => {
      try {
        const [bobCatRes, molinoRes, referenciaRes, bultoRes] =
          await Promise.all([
            axios.get(`http://${localIP}:3000/bob_cats`),
            axios.get(`http://${localIP}:3000/molinos`),
            axios.get(`http://${localIP}:3000/referencias`),
            axios.get(`http://${localIP}:3000/bultos`),
          ]);

        setBobCat(bobCatRes.data);
        setMolino(molinoRes.data);
        setReferencia(referenciaRes.data);
        setBulto(bultoRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    getItems();
  }, [localIP]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const [controlCalidadRes, mecanicoRes, operadorRes, cargueroRes] =
          await Promise.all([
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 3 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 7 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 6 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 8 }
            ),
          ]);

        setControlCalidad(controlCalidadRes.data);
        setMecanico(mecanicoRes.data);
        setOperador(operadorRes.data);
        setCarguero(cargueroRes.data);
      } catch (error) {
        console.error("Error al obtener usuarios por perfil:", error);
      }
    };

    getUsers();
  }, [localIP]);
  useEffect(() => {
    setMolinoInformeInicial(
      molino.map((molinoItem) => molinoItem.nombre_molino)
    );
  }, [molino]);
  useEffect(() => {
    setBobCatInformeInicial(
      bobCat.map((bobCatItem) => bobCatItem.nombre_bob_cat)
    );
  }, [bobCat]);

  const addQualityControl = (id_usuario, nombre_usuario) => {
    setControlCalidadInformeInicial((prev) => [
      ...prev,
      { id_usuario, nombre_usuario },
    ]);
  };
  const removeQualityControl = (index) => {
    setControlCalidadInformeInicial((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };
  const addMechanic = (id_usuario, nombre_usuario) => {
    setMecanicoInformeInicial((prev) => [
      ...prev,
      { id_usuario, nombre_usuario },
    ]);
  };
  const removeMechanic = (index) => {
    setMecanicoInformeInicial((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOperadorChange = (index, value) => {
    setOperadorInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleReferenciaChange = (index, value) => {
    setReferenciaInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleBultoChange = (index, value) => {
    setBultoInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleHorometroChange = (index, value) => {
    setHorometroInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleCargueroChange = (index, value) => {
    setCargueroInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const validation = () => {
    const errors = {};

    if (!controlCalidadInformeInicial) {
      errors.controlCalidadInformeInicial =
        "El control de calidad del informe es obligatorio.";
    }
    if (!mecanicoInformeInicial) {
      errors.mecanicoInformeInicial = "El mecánico del informe es obligatorio.";
    }
    if (!operadorInformeInicial) {
      errors.operadorInformeInicial =
        "El operador del molino del informe es obligatorio.";
    }
    if (!referenciaInformeInicial) {
      errors.referenciaInformeInicial =
        "La referencia del molino del informe es obligatorio.";
    }
    if (!bultoInformeInicial) {
      errors.bultoInformeInicial =
        "El bulto del molino del informe es obligatorio.";
    }
    if (!horometroInformeInicial) {
      errors.horometroInformeInicial =
        "El horómetro inicial del molino del informe es obligatorio.";
    } else if (!/^[0-9.,]+$/.test(horometroInformeInicial)) {
      errors.horometroInformeInicial =
        "El horómetro inicial del molino del informe debe ser un número válido.";
    }
    if (!cargueroInformeInicial) {
      errors.cargueroInformeInicial =
        "El operador del minicargador del informe es obligatorio.";
    }
    if (!bobCatInformeInicial) {
      errors.bobCatInformeInicial =
        "El minicargador del informe es obligatorio.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const sendCreate = async (e) => {
    e.preventDefault();

    // if (!validation()) {
    //   return;
    // }

    setServerError(null);
    // setLoading(true);

    const fechaInformeInicial = new Date().toISOString().split("T")[0];
    const horaInformeInicial = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const fullReport = [
      {
        titular_informe_inicial: titularInformeInicial,
        fecha_informe_inicial: fechaInformeInicial,
        hora_informe_inicial: horaInformeInicial,
        turno_informe_inicial: currentShift.nombre_turno,
        cdc_informe_inicial: controlCalidadInformeInicial,
        observacion_informe_inicial: observacionInformeInicial,
      },
    ];

    try {
      // await axios.post(`http://${localIP}:3000/informes_iniciales`, fullReport);
      console.log(fullReport);
      console.log(controlCalidadInformeInicial);
      console.log(mecanicoInformeInicial);
      console.log(
        operadorInformeInicial,
        molinoInformeInicial,
        referenciaInformeInicial,
        bultoInformeInicial,
        horometroInformeInicial
      );
      console.log(cargueroInformeInicial, bobCatInformeInicial);
      // setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al crear el informe inicial. Por favor, inténtelo de nuevo.`
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/generatereportmenu");
  };

  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={Style.generateInitialReportFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Reporte inicial creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.generateInitialReportForm}
          onSubmit={sendCreate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.generateInitialReportFormHeader}>
            <h1>Complete los datos para crear el reporte inicial</h1>
          </header>
          <main className={Style.generateInitialReportFormMain}>
            <fieldset>
              <label htmlFor="controlcalidad">
                Seleccione un control de calidad
              </label>
              <select
                id="controlcalidad"
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addQualityControl(e.target.value, selectedOption.text);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un control de calidad
                </option>
                {controlCalidad.map((cdc) => (
                  <option key={cdc.id_usuario} value={cdc.id_usuario}>
                    {cdc.nombre_usuario}
                  </option>
                ))}
              </select>
            </fieldset>
            <ul>
              {controlCalidadInformeInicial.map((item, index) => (
                <li key={index}>
                  {item.nombre_usuario}{" "}
                  <button
                    type="button"
                    onClick={() => removeQualityControl(index)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <fieldset>
              <label htmlFor="mecanico">Seleccione un mecánico</label>
              <select
                id="mecanico"
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addMechanic(e.target.value, selectedOption.text);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un mecánico
                </option>
                {mecanico.map((mecanico) => (
                  <option key={mecanico.id_usuario} value={mecanico.id_usuario}>
                    {mecanico.nombre_usuario}
                  </option>
                ))}
              </select>
            </fieldset>
            <ul>
              {mecanicoInformeInicial.map((item, index) => (
                <li key={index}>
                  {item.nombre_usuario}{" "}
                  <button type="button" onClick={() => removeMechanic(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            {molino.map((molinoItem, index) => (
              <fieldset key={index}>
                <legend>{molinoItem.nombre_molino}</legend>

                <label htmlFor={`operador-${index}`}>Operador</label>
                <select
                  id={`operador-${index}`}
                  value={operadorInformeInicial[index] || ""}
                  onChange={(e) => handleOperadorChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione un operador
                  </option>
                  {operador.map((op) => (
                    <option key={op.id_usuario} value={op.nombre_usuario}>
                      {op.nombre_usuario}
                    </option>
                  ))}
                </select>

                <label htmlFor={`referencia-${index}`}>Referencia</label>
                <select
                  id={`referencia-${index}`}
                  value={referenciaInformeInicial[index] || ""}
                  onChange={(e) =>
                    handleReferenciaChange(index, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Seleccione una referencia
                  </option>
                  {referencia.map((ref) => (
                    <option
                      key={ref.id_referencia}
                      value={ref.nombre_referencia}
                    >
                      {ref.nombre_referencia}
                    </option>
                  ))}
                </select>

                <label htmlFor={`bulto-${index}`}>Bulto</label>
                <select
                  id={`bulto-${index}`}
                  value={bultoInformeInicial[index] || ""}
                  onChange={(e) => handleBultoChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione un bulto
                  </option>
                  {bulto.map((bul) => (
                    <option key={bul.id_bulto} value={bul.nombre_bulto}>
                      {bul.nombre_bulto}
                    </option>
                  ))}
                </select>

                <label htmlFor={`horometro-${index}`}>Horómetro</label>
                <input
                  id={`horometro-${index}`}
                  type="number"
                  value={horometroInformeInicial[index] || ""}
                  onChange={(e) => handleHorometroChange(index, e.target.value)}
                />
              </fieldset>
            ))}
            {bobCat.map((bobCatItem, index) => (
              <fieldset key={index}>
                <legend>{bobCatItem.nombre_bob_cat}</legend>

                <label htmlFor={`carguero-${index}`}>Carguero</label>
                <select
                  id={`carguero-${index}`}
                  value={cargueroInformeInicial[index] || ""}
                  onChange={(e) => handleCargueroChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione un carguero
                  </option>
                  {carguero.map((carguero) => (
                    <option
                      key={carguero.id_usuario}
                      value={carguero.nombre_usuario}
                    >
                      {carguero.nombre_usuario}
                    </option>
                  ))}
                </select>
              </fieldset>
            ))}
          </main>
          <footer className={Style.generateInitialReportFormFooter}>
            <button onClick={() => redirectGenerateReport()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear Informe inicial"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.generateInitialReportFormValidationServer}
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

export default GenerateInitialReportForm;
