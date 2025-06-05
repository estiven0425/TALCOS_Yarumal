import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-component-form.module.css";

function GenerateNoveltyMechanicForm() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [currentMechanic, setCurrentMechanic] = useState([]);
  const [mecanicoNovedad, setMecanicoNovedad] = useState("");
  const [observacionNovedad, setObservacionNovedad] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const [sendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/noveltyoption");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);
  useEffect(() => {
    const getData = async () => {
      try {
        const responseMechanic = await axios.post(
          `http://${localIP}:3000/usuarios/informeinicialusuario`,
          { idPerfil: 7 }
        );
        const mechanics = responseMechanic.data;
        const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShifts.data;
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

        if (!currentShift) {
          console.error("No se pudo determinar el turno actual.");
          return;
        }

        let currentDate = new Date();

        if (
          currentShift.fin_turno < currentShift.inicio_turno &&
          currentTime.getHours() < 6
        ) {
          currentDate = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate() - 1
          );
        }

        const {
          nombre_turno: turno,
          inicio_turno: inicioTurno,
          fin_turno: finTurno,
        } = currentShift;
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;
        const usedMechanicIds = new Set([
          ...reports
            .filter((reports) => reports.mecanico_informe_inicial !== null)
            .map((reports) => reports.mecanico_informe_inicial),
          ...news
            .filter((news) => news.mecanico_novedad !== null)
            .map((news) => news.mecanico_novedad),
        ]);
        const availableMechanics = mechanics.filter(
          (mecanico) => !usedMechanicIds.has(mecanico.id_usuario)
        );

        setCurrentData(reports);
        setFinalData(endReports);
        setCurrentMechanic(availableMechanics);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    getData();
  }, [localIP]);

  const validation = () => {
    const errors = {};

    if (!mecanicoNovedad.trim()) {
      errors.mecanicoNovedad = "El mecánico es obligatorio.";
    }

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };
  const determinateShift = (data) => {
    if (!data || data.length === 0) return null;

    const turnoCounts = data.reduce((acc, item) => {
      const turno = item.turno_informe_inicial;

      acc[turno] = (acc[turno] || 0) + 1;

      return acc;
    }, {});
    const mostFrequentTurno = Object.keys(turnoCounts).reduce((a, b) =>
      turnoCounts[a] > turnoCounts[b] ? a : b
    );

    return mostFrequentTurno;
  };
  const determinateDate = (data) => {
    if (!data || data.length === 0) return null;

    const dateCounts = data.reduce((acc, item) => {
      const date = item.fecha_informe_inicial;

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    const mostFrequentDate = Object.keys(dateCounts).reduce((a, b) =>
      dateCounts[a] > dateCounts[b] ? a : b
    );

    return mostFrequentDate;
  };
  const sendCreate = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    const horaNovedad = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const fechaNovedad = determinateDate(currentData);
    const shiftNovelty = determinateShift(currentData);
    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Adición de mecánico",
        mecanico_novedad: mecanicoNovedad,
        observacion_novedad: observacionNovedad,
      },
    ];

    try {
      await axios.post(`http://${localIP}:3000/novedades`, novedad);

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al crear la adición de mecánico. Por favor, inténtelo de nuevo.`
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/noveltyoption");
  };

  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyComponentFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>El informe del turno ya ha finalizado</h1>
        </motion.div>
      ) : (
        <>
          {loadingAlternative ? (
            <motion.div
              className={Style.generateNoveltyComponentFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : sendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyComponentFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Mecánico añadido con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyComponentForm}
              onSubmit={sendCreate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header className={Style.generateNoveltyComponentFormHeader}>
                <h1>Complete los datos para cambiar el mecánico</h1>
              </header>
              <main className={Style.generateNoveltyComponentFormMain}>
                <fieldset>
                  <label htmlFor="mecanicoNovedad">Nuevo mecánico</label>
                  <select
                    id="mecanicoNovedad"
                    name="mecanicoNovedad"
                    value={mecanicoNovedad}
                    onChange={(e) => setMecanicoNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un nuevo mecánico
                    </option>
                    {currentMechanic.map((item) => (
                      <option key={item.id_usuario} value={item.id_usuario}>
                        {item.nombre_usuario}
                      </option>
                    ))}
                  </select>
                  {validationError.mecanicoNovedad && (
                    <motion.span
                      className={Style.generateNoveltyComponentFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.mecanicoNovedad}
                    </motion.span>
                  )}
                </fieldset>

                <fieldset>
                  <label htmlFor="observacionNovedad">Observación</label>
                  <input
                    id="observacionNovedad"
                    name="observacionNovedad"
                    type="text"
                    value={observacionNovedad}
                    onChange={(e) => setObservacionNovedad(e.target.value)}
                    placeholder="Ingresa una observación"
                  />
                  {!validationError.observacionNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyComponentFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.observacionNovedad}
                    </motion.span>
                  )}
                </fieldset>
              </main>
              <footer className={Style.generateNoveltyComponentFormFooter}>
                <button onClick={() => redirectGenerateReport()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Añadir mecánico"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyComponentFormValidationServer
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
            <motion.div
              className={Style.generateNoveltyComponentFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>El informe inicial del turno no ha sido creado</h1>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}

export default GenerateNoveltyMechanicForm;
