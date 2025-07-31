import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "./styles/generate-novelty-strike-start-form.module.css";

function GenerateNoveltyStrikeStartForm() {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [molino, setMolino] = useState([]);
  const [molinoNovedad, setMolinoNovedad] = useState("");
  const [inicioParoNovedad, setInicioParoNovedad] = useState("");
  const [finParoNovedad, setFinParoNovedad] = useState("");
  const [horometroInicioParoNovedad, setHorometroInicioParoNovedad] =
    useState("");
  const [horometroFinParoNovedad, setHorometroFinParoNovedad] = useState("");
  const [motivoParoNovedad, setMotivoParoNovedad] = useState("");
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
        // noinspection HttpUrlsUsage
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;

        // noinspection HttpUrlsUsage
        const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShifts.data;

        const currentTime = new Date();

        const getShiftForDate = (shifts, now) => {
          const compareTime = (hour, start, end) => {
            const [startHour, startMinute] = start.split(":").map(Number);
            const [endHour, endMinute] = end.split(":").map(Number);

            const startTimeMs = (startHour * 60 + startMinute) * 60000;
            const endTimeMs = (endHour * 60 + endMinute) * 60000;
            const currentTimeMs =
              (hour.getHours() * 60 + hour.getMinutes()) * 60000;

            const isInShift =
              endTimeMs > startTimeMs
                ? currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs
                : currentTimeMs >= startTimeMs || currentTimeMs < endTimeMs;

            return {
              isInShift,
              crossesMidnight: endTimeMs <= startTimeMs,
              startTimeMs,
              endTimeMs,
              currentTimeMs,
            };
          };

          for (const shift of shifts) {
            const { isInShift, crossesMidnight, currentTimeMs, startTimeMs } =
              compareTime(now, shift.inicio_turno, shift.fin_turno);

            if (shift.inicio_turno > shift.fin_turno) {
              if (isInShift) {
                const fechaTurno = new Date(now);

                if (crossesMidnight && currentTimeMs < startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() - 1);
                } else fechaTurno.setDate(fechaTurno.getDate() - 1);

                return { shift, fechaTurno };
              }
            } else {
              if (isInShift) {
                const fechaTurno = new Date(now);

                if (crossesMidnight && currentTimeMs < startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() - 1);
                } else fechaTurno.setDate(fechaTurno.getDate() - 1);

                if (currentTimeMs > startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() + 1);
                }

                return { shift, fechaTurno };
              }
            }
          }

          return { shift: null, fechaTurno: null };
        };

        const { shift: currentShift, fechaTurno } = getShiftForDate(
          shifts,
          currentTime,
        );

        if (!currentShift) {
          console.warn("No se encontró turno actual.");
          return;
        }

        setCurrentShift(currentShift);

        // noinspection HttpUrlsUsage
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;

        const evaluateIsInParo = (report, allNovelties) => {
          if (!report?.molino_informe_inicial) {
            const turnOnNovelty = allNovelties.find(
              (nov) => nov.tipo_novedad === "Encendido de molino",
            );

            if (
              turnOnNovelty ||
              allNovelties.some(
                (nov) =>
                  nov.tipo_novedad === "Cambio de referencia" ||
                  nov.tipo_novedad === "Cambio de operador de molino",
              )
            ) {
              const pauses = allNovelties
                .filter((nov) => nov.tipo_novedad === "Paro")
                .sort(
                  (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad),
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
                      inicioMinute,
                    );

                    let finParo = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate(),
                      finHour,
                      finMinute,
                    );

                    const [startHour] = currentShift.inicio_turno
                      .split(":")
                      .map(Number);
                    const [endHour] = currentShift.fin_turno
                      .split(":")
                      .map(Number);
                    const turnoCruzaMedianoche = endHour < startHour;

                    if (turnoCruzaMedianoche) {
                      const horaActual = now.getHours();

                      if (horaActual < endHour) {
                        if (inicioHour >= startHour) {
                          inicioParo.setDate(inicioParo.getDate() - 1);
                        }

                        if (finHour >= startHour || finHour < endHour) {
                          if (finHour >= startHour) {
                            finParo.setDate(finParo.getDate() - 1);
                          }
                        }
                      } else {
                        if (finHour < startHour) {
                          finParo.setDate(finParo.getDate() + 1);
                        }
                      }
                    } else {
                      if (finParo <= inicioParo) {
                        finParo.setDate(finParo.getDate() + 1);
                      }
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
              (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad),
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
                  inicioMinute,
                );

                let finParo = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  finHour,
                  finMinute,
                );

                const [startHour] = currentShift.inicio_turno
                  .split(":")
                  .map(Number);
                const [endHour] = currentShift.fin_turno.split(":").map(Number);
                const turnoCruzaMedianoche = endHour < startHour;

                if (turnoCruzaMedianoche) {
                  const horaActual = now.getHours();

                  if (horaActual < endHour) {
                    if (inicioHour >= startHour) {
                      inicioParo.setDate(inicioParo.getDate() - 1);
                    }

                    if (finHour >= startHour || finHour < endHour) {
                      if (finHour >= startHour) {
                        finParo.setDate(finParo.getDate() - 1);
                      }
                    }
                  } else {
                    if (finHour < startHour) {
                      finParo.setDate(finParo.getDate() + 1);
                    }
                  }
                } else {
                  if (finParo <= inicioParo) {
                    finParo.setDate(finParo.getDate() + 1);
                  }
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
              (report) =>
                report.molino_informe_inicial === molino.nombre_molino,
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial),
            )[0];

          const millNovelties = news.filter(
            (novelty) => novelty.molino_novedad === molino.nombre_molino,
          );

          const novelty = millNovelties.sort(
            (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad),
          )[0];

          const recent =
            report &&
            (!novelty ||
              new Date(
                report.fecha_informe_inicial +
                  " " +
                  report.hora_informe_inicial,
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
            operator:
              recent?.operador_informe_inicial ||
              recent?.operador_novedad ||
              "",
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

    void getData();
  }, [localIP]);

  const isTimeWithinShift = (hourString) => {
    const [hour, minute] = hourString.split(":").map(Number);
    const timeMs = (hour * 60 + minute) * 60000;

    const [startHour, startMinute] = currentShift.inicio_turno
      .split(":")
      .map(Number);
    const [endHour, endMinute] = currentShift.fin_turno.split(":").map(Number);

    const startMs = (startHour * 60 + startMinute) * 60000;
    const endMs = (endHour * 60 + endMinute) * 60000;

    if (endMs > startMs) {
      return timeMs >= startMs && timeMs < endMs;
    } else {
      return timeMs >= startMs || timeMs < endMs;
    }
  };

  const validation = () => {
    const errors = {};

    if (!molinoNovedad.trim()) {
      errors.molinoNovedad = "El molino es obligatorio.";
    }
    if (!inicioParoNovedad.trim()) {
      errors.inicioParoNovedad = "El inicio de paro es obligatorio.";
    } else if (!isTimeWithinShift(inicioParoNovedad)) {
      errors.inicioParoNovedad =
        "La hora de inicio debe estar dentro del turno.";
    }
    if (finParoNovedad.trim() && !isTimeWithinShift(finParoNovedad)) {
      errors.finParoNovedad = "La hora de fin debe estar dentro del turno.";
    }
    if (!horometroInicioParoNovedad.trim()) {
      errors.horometroInicioParoNovedad =
        "El horómetro de inicio de paro es obligatorio.";
    }
    // noinspection JSCheckFunctionSignatures
    if (horometroInicioParoNovedad && isNaN(horometroInicioParoNovedad)) {
      errors.horometroInicioParoNovedad =
        "El horómetro de inicio debe ser un número.";
    }
    // noinspection JSCheckFunctionSignatures
    if (horometroFinParoNovedad && isNaN(horometroFinParoNovedad)) {
      errors.horometroFinParoNovedad =
        "El horómetro de fin debe ser un número.";
    }
    if (
      (finParoNovedad.trim() && !horometroFinParoNovedad.trim()) ||
      (!finParoNovedad.trim() && horometroFinParoNovedad.trim())
    ) {
      if (!finParoNovedad.trim()) {
        errors.finParoNovedad =
          "Si se ingresa el horómetro de fin, la hora de fin también es obligatoria.";
      }
      if (!horometroFinParoNovedad.trim()) {
        errors.horometroFinParoNovedad =
          "Si se ingresa la hora de fin, el horómetro de fin también es obligatorio.";
      }
    }
    if (!motivoParoNovedad.trim()) {
      errors.motivoParoNovedad = "El motivo del paro es obligatorio.";
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

    // noinspection UnnecessaryLocalVariableJS
    const mostFrequentTurno = Object.keys(turnoCounts).reduce((a, b) =>
      turnoCounts[a] > turnoCounts[b] ? a : b,
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

    // noinspection UnnecessaryLocalVariableJS
    const mostFrequentDate = Object.keys(dateCounts).reduce((a, b) =>
      dateCounts[a] > dateCounts[b] ? a : b,
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
      (item) => item.name === molinoNovedad,
    );

    const referenceNovelty = matchingWindmill?.reference || "";
    const bulkNovelty = matchingWindmill?.bulk || "";
    const operatorNovelty = matchingWindmill?.operator || "";

    const inicioParoConSegundos = inicioParoNovedad.includes(":")
      ? `${inicioParoNovedad}:00`
      : inicioParoNovedad;

    const finParoConSegundos = finParoNovedad.trim()
      ? `${finParoNovedad}:00`
      : null;

    const horometroFinParo = horometroFinParoNovedad.trim()
      ? parseFloat(horometroFinParoNovedad)
      : null;

    let date = new Date();

    if (date.getHours() >= 22  && date.getHours() < 0) {
      date.setDate(date.getDate() - 1);
    }

    if (date.getHours() >= 0  && date.getHours() < 6) {
      date.setDate(date.getDate() + 1);
    }

    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        fecha_auxiliar_novedad: date.toISOString().split("T")[0],
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Paro",
        molino_novedad: molinoNovedad,
        referencia_novedad: referenceNovelty,
        bulto_novedad: bulkNovelty,
        inicio_paro_novedad: inicioParoConSegundos,
        fin_paro_novedad: finParoConSegundos,
        horometro_inicio_paro_novedad: horometroInicioParoNovedad,
        horometro_fin_paro_novedad: horometroFinParo,
        motivo_paro_novedad: motivoParoNovedad,
        operador_novedad: operatorNovelty,
        observacion_novedad: observacionNovedad,
      },
    ];

    try {
      // noinspection HttpUrlsUsage
      await axios.post(`http://${localIP}:3000/novedades`, novedad);

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          `Error al crear el paro. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/noveltystrike");
  };

  // noinspection JSValidateTypes
  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyStrikeStartFormAlternative}
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
              className={Style.generateNoveltyStrikeStartFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : sendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyStrikeStartFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Paro creado con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyStrikeStartForm}
              onSubmit={sendCreate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header className={Style.generateNoveltyStrikeStartFormHeader}>
                <h1>Complete los datos para crear el paro</h1>
              </header>
              <main className={Style.generateNoveltyStrikeStartFormMain}>
                <fieldset
                  className={Style.generateNoveltyStrikeStartFormMainEspecial}
                >
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
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.molinoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor="inicioParoNovedad">Inicio de paro</label>
                  <input
                    id="inicioParoNovedad"
                    name="inicioParoNovedad"
                    type="time"
                    value={inicioParoNovedad}
                    onChange={(e) => setInicioParoNovedad(e.target.value)}
                  />
                  {!validationError.inicioParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.inicioParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
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
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.finParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor="horometroInicioParoNovedad">
                    Horómetro inicio de Paro
                  </label>
                  <input
                    id="horometroInicioParoNovedad"
                    name="horometroInicioParoNovedad"
                    type="text"
                    value={horometroInicioParoNovedad}
                    onChange={(e) =>
                      setHorometroInicioParoNovedad(e.target.value)
                    }
                    placeholder="Ingrese el horómetro de inicio de paro"
                  />
                  {!validationError.horometroInicioParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.horometroInicioParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
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
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.horometroFinParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={Style.generateNoveltyStrikeStartFormMainEspecial}
                >
                  <label htmlFor="motivoParoNovedad">Motivo del paro</label>
                  <select
                    id="motivoParoNovedad"
                    name="motivoParoNovedad"
                    value={motivoParoNovedad}
                    onChange={(e) => setMotivoParoNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un motivo
                    </option>
                    <option value="Sostenimiento general">
                      Sostenimiento general
                    </option>
                    <option value="Mecánico">Mecánico</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Corte de energía">Corte de energía</option>
                    <option value="Materia prima">Materia prima</option>
                    <option value="Empaque">Empaque</option>
                    <option value="Guijos">Guijos</option>
                    <option value="Personal">Personal</option>
                    <option value="Programado">Programado</option>
                    <option value="Bodega">Bodega</option>
                    <option value="Apagado">Apagado</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {!validationError.motivoParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.motivoParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={Style.generateNoveltyStrikeStartFormMainEspecial}
                >
                  <label htmlFor="observacionNovedad">Observación</label>
                  <input
                    id="observacionNovedad"
                    name="observacionNovedad"
                    type="text"
                    value={observacionNovedad}
                    onChange={(e) => setObservacionNovedad(e.target.value)}
                    placeholder="Ingresa una observación"
                  />
                </fieldset>
              </main>
              <footer className={Style.generateNoveltyStrikeStartFormFooter}>
                <button onClick={() => redirectGenerateReport()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Crear paro"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyStrikeStartFormValidationServer
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
              className={Style.generateNoveltyStrikeStartFormAlternative}
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

export default GenerateNoveltyStrikeStartForm;
