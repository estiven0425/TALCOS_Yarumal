import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-component-form.module.css";

function GenerateNoveltyOperatorForm() {
  const [operador, setOperador] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [molino, setMolino] = useState([]);
  const [molinoNovedad, setMolinoNovedad] = useState("");
  const [operadorNovedad, setOperadorNovedad] = useState("");
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
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;
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
        const evaluateIsInParo = (report, allNovelties) => {
          if (!report?.molino_informe_inicial) {
            const turnOnNovelty = allNovelties.find(
              (nov) => nov.tipo_novedad === "Encendido de molino"
            );

            if (turnOnNovelty) {
              const pauses = allNovelties
                .filter((nov) => nov.tipo_novedad === "Paro")
                .sort(
                  (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad)
                );

              if (pauses.length > 0) {
                const latestPause = pauses[0];

                if (
                  latestPause.inicio_paro_novedad &&
                  latestPause.horometro_inicio_paro_novedad
                ) {
                  if (
                    !latestPause.fin_paro_novedad &&
                    !latestPause.horometro_fin_paro_novedad
                  ) {
                    return true;
                  } else if (latestPause.fin_paro_novedad) {
                    const now = new Date();
                    const [inicioHour, inicioMinute] =
                      latestPause.inicio_paro_novedad.split(":").map(Number);
                    const [finHour, finMinute] = latestPause.fin_paro_novedad
                      .split(":")
                      .map(Number);
                    const inicioParo = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate(),
                      inicioHour,
                      inicioMinute
                    );

                    let finParo = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate(),
                      finHour,
                      finMinute
                    );

                    if (finParo <= inicioParo) {
                      finParo.setDate(finParo.getDate() + 1);
                    }
                    return now < finParo;
                  }
                  return false;
                }
                return false;
              }
              return false;
            }
            return true;
          }

          const pauses = allNovelties
            .filter((nov) => nov.tipo_novedad === "Paro")
            .sort(
              (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad)
            );

          if (pauses.length > 0) {
            const latestPause = pauses[0];

            if (
              latestPause.inicio_paro_novedad &&
              latestPause.horometro_inicio_paro_novedad
            ) {
              if (
                !latestPause.fin_paro_novedad &&
                !latestPause.horometro_fin_paro_novedad
              ) {
                return true;
              } else if (latestPause.fin_paro_novedad) {
                const now = new Date();
                const [inicioHour, inicioMinute] =
                  latestPause.inicio_paro_novedad.split(":").map(Number);
                const [finHour, finMinute] = latestPause.fin_paro_novedad
                  .split(":")
                  .map(Number);
                const inicioParo = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  inicioHour,
                  inicioMinute
                );

                let finParo = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  finHour,
                  finMinute
                );

                if (finParo <= inicioParo) {
                  finParo.setDate(finParo.getDate() + 1);
                }
                return now < finParo;
              }
            }
          }
          return false;
        };
        const combinedData = mills.map((molino) => {
          const report = reports
            .filter(
              (report) => report.molino_informe_inicial === molino.nombre_molino
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial)
            )[0];
          const millNovelties = news.filter(
            (novelty) => novelty.molino_novedad === molino.nombre_molino
          );
          const novelty = millNovelties.sort(
            (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad)
          )[0];
          const recent =
            report &&
            (!novelty ||
              new Date(
                report.fecha_informe_inicial + " " + report.hora_informe_inicial
              ) > new Date(novelty.fecha_novedad + " " + novelty.hora_novedad))
              ? report
              : novelty;
          const isInParo = evaluateIsInParo(report, millNovelties);

          return {
            name: molino.nombre_molino,
            reference:
              recent?.referencia_informe_inicial ||
              recent?.referencia_novedad ||
              "No se registró",
            bulk:
              recent?.bulto_informe_inicial ||
              recent?.bulto_novedad ||
              "No se registró",
            isInParo,
          };
        });

        setCurrentData(reports);
        setFinalData(endReports);
        setMolino(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    getData();
  }, [localIP]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.post(
          `http://${localIP}:3000/usuarios/informeinicialusuario`,
          { idPerfil: 6 }
        );
        setOperador(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };

    getUser();
  }, [localIP]);

  const validation = () => {
    const errors = {};

    if (!molinoNovedad.trim()) {
      errors.molinoNovedad = "El molino es obligatorio.";
    }
    if (!operadorNovedad.trim()) {
      errors.operadorNovedad = "El operador del molino es obligatorio.";
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
    const matchingWindmill = molino?.find(
      (item) => item.name === molinoNovedad
    );
    const referencenovelty = matchingWindmill?.reference || "";
    const bulknovelty = matchingWindmill?.bulk || "";
    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Cambio de operador de molino",
        molino_novedad: molinoNovedad,
        referencia_novedad: referencenovelty,
        bulto_novedad: bulknovelty,
        operador_novedad: operadorNovedad,
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
          `Error al crear el cambio de operador de molino. Por favor, inténtelo de nuevo.`
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
              <h1>Operador de molino cambiado con éxito</h1>
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
                <h1>Complete los datos para cambiar el operador del molino</h1>
              </header>
              <main className={Style.generateNoveltyComponentFormMain}>
                <fieldset>
                  <label htmlFor="molinoNovedad">Seleccione un molino</label>
                  <select
                    id="molinoNovedad"
                    name="molinoNovedad"
                    value={molinoNovedad}
                    onChange={(e) => setMolinoNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un molino
                    </option>
                    {molino
                      .filter((item) => !item.isInParo)
                      .map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {!validationError.molinoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyComponentFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.molinoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <div
                  className={Style.generateNoveltyComponentFormMainAlternative}
                >
                  <fieldset>
                    <label htmlFor="operadorNovedad">Operador de molino</label>
                    <select
                      id="operadorNovedad"
                      name="operadorNovedad"
                      onChange={(e) => setOperadorNovedad(e.target.value)}
                      value={operadorNovedad}
                    >
                      <option value="" disabled>
                        Seleccione un operador de molino
                      </option>
                      {operador.map((operador) => (
                        <option
                          key={operador.id_usuario}
                          value={operador.id_usuario}
                        >
                          {operador.nombre_usuario}
                        </option>
                      ))}
                    </select>
                    {!validationError.operadorNovedad ? (
                      <></>
                    ) : (
                      <motion.span
                        className={Style.generateNoveltyComponentFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.operadorNovedad}
                      </motion.span>
                    )}
                  </fieldset>
                </div>
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
                    "Cambiar operador de molino"
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

export default GenerateNoveltyOperatorForm;
