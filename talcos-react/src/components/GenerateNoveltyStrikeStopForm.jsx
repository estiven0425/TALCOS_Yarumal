import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-strike-stop-form.module.css";

function GenerateNoveltyStrikeStopForm() {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [idNovedad, setIdNovedad] = useState("");
  const [finParoNovedad, setFinParoNovedad] = useState("");
  const [horometroFinParoNovedad, setHorometroFinParoNovedad] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const novelty = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    setIdNovedad(novelty);
  }, [novelty]);
  useEffect(() => {
    const getData = async () => {
      try {
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

        setCurrentShift(currentShift);

        const currentDate = currentTime.toISOString().split("T")[0];
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
        const endReports = responseEndReport.data;

        setCurrentData(reports);
        setFinalData(endReports);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    getData();
  }, [localIP]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/noveltystrikestop");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!finParoNovedad.trim()) {
      errors.finParoNovedad = "El fin de paro es obligatorio.";
    } else {
      const [inicioTurnoHour, inicioTurnoMinute] = currentShift.inicio_turno
        .split(":")
        .map(Number);
      const [finTurnoHour, finTurnoMinute] = currentShift.fin_turno
        .split(":")
        .map(Number);
      const [finParoHour, finParoMinute] = finParoNovedad
        .split(":")
        .map(Number);
      const inicioTurnoMs = (inicioTurnoHour * 60 + inicioTurnoMinute) * 60000;
      const finTurnoMs = (finTurnoHour * 60 + finTurnoMinute) * 60000;
      const finParoMs = (finParoHour * 60 + finParoMinute) * 60000;

      if (!(finParoMs >= inicioTurnoMs && finParoMs < finTurnoMs)) {
        errors.finParoNovedad = "La hora de fin debe estar dentro del turno.";
      }
    }
    if (!horometroFinParoNovedad) {
      errors.horometroFinParoNovedad = "El horómetro de fin es obligatorio.";
    } else if (!/^[0-9]+$/.test(horometroFinParoNovedad)) {
      errors.horometroFinParoNovedad = "El horómetro debe ser solo numeros.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const sendEditNovelty = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/novedades/finparonovedad`, {
        id_novedad: idNovedad,
        fin_paro_novedad: finParoNovedad,
        horometro_fin_paro_novedad: horometroFinParoNovedad,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al finalizar el paro. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectNovelty = () => {
    navigate("/generatereport/noveltystrike");
  };

  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyStrikeStopFormAlternative}
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
              className={Style.generateNoveltyStrikeStopFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : SendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyStrikeStopFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Paro finalizado con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyStrikeStopForm}
              onSubmit={sendEditNovelty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header className={Style.generateNoveltyStrikeStopFormHeader}>
                <h1>Complete los datos para finalizar el paro</h1>
              </header>
              <main className={Style.generateNoveltyStrikeStopFormMain}>
                <fieldset
                  className={Style.generateNoveltyStrikeStopFormMainEspecial}
                >
                  <label htmlFor="finParoNovedad">Fin de paro</label>
                  <input
                    id="finParoNovedad"
                    name="finParoNovedad"
                    type="time"
                    value={finParoNovedad}
                    onChange={(e) => setFinParoNovedad(e.target.value)}
                  />
                  {!validationError.finParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStopFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.finParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={Style.generateNoveltyStrikeStopFormMainEspecial}
                >
                  <label htmlFor="horometroFinParoNovedad">
                    Horómetro fin de paro
                  </label>
                  <input
                    id="horometroFinParoNovedad"
                    name="horometroFinParoNovedad"
                    type="text"
                    value={horometroFinParoNovedad}
                    onChange={(e) => setHorometroFinParoNovedad(e.target.value)}
                    placeholder="Ingrese el horómetro de fin de paro"
                  />
                  {!validationError.horometroFinParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStopFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.horometroFinParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
              </main>
              <footer className={Style.generateNoveltyStrikeStopFormFooter}>
                <button onClick={() => redirectNovelty()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Finalizar paro"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyStrikeStopFormValidationServer
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
              className={Style.generateNoveltyStrikeStopFormAlternative}
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

export default GenerateNoveltyStrikeStopForm;
