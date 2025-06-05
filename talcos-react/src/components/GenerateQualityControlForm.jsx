import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-quality-control-form.module.css";

function GenerateQualityControlForm() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [molino, setMolino] = useState([]);
  const [molinoControlCalidad, setMolinoControlCalidad] = useState("");
  const [rechazadoControlCalidad, setRechazadoControlCalidad] = useState("");
  const [retencionControlCalidad, setRetencionControlCalidad] = useState("");
  const [observacionControlCalidad, setObservacionControlCalidad] =
    useState("");
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
        navigate("/generatereport/generatereportmenu");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;
        const responseBulks = await axios.get(`http://${localIP}:3000/bultos`);
        const bulks = responseBulks.data;
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
          const bulkInUse = bulks.find(
            (bulto) =>
              bulto.nombre_bulto ===
              (recent?.bulto_informe_inicial || recent?.bulto_novedad || "")
          );

          return {
            name: molino.nombre_molino,
            reference:
              recent?.referencia_informe_inicial ||
              recent?.referencia_novedad ||
              "No se registró",
            bulk: bulkInUse?.nombre_bulto || "No se registró",
            capacity: bulkInUse?.capacidad_bulto || "No se registró",
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
  const validation = () => {
    const errors = {};

    if (!molinoControlCalidad.trim()) {
      errors.molinoControlCalidad = "El molino es obligatorio.";
    }
    if (!rechazadoControlCalidad.trim()) {
      errors.rechazadoControlCalidad =
        "La cantidad de bultos rechazados es obligatoria.";
    }
    if (rechazadoControlCalidad && isNaN(rechazadoControlCalidad)) {
      errors.rechazadoControlCalidad =
        "La cantidad de bultos rechazados debe ser un número.";
    }
    if (!retencionControlCalidad.trim()) {
      errors.retencionControlCalidad = "La retención es obligatoria.";
    }
    if (retencionControlCalidad && isNaN(retencionControlCalidad)) {
      errors.retencionControlCalidad = "La retención debe ser un número.";
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

    const horaControlCalidad = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const fechaControlCalidad = determinateDate(currentData);
    const shiftQualityControl = determinateShift(currentData);
    const matchingWindmill = molino?.find(
      (item) => item.name === molinoControlCalidad
    );
    const referenceQualityControl = matchingWindmill?.reference || "";
    const bulkQualityControl = matchingWindmill?.bulk || "";
    const cantidadProductoRechazado =
      (matchingWindmill?.capacity * parseInt(rechazadoControlCalidad)) / 1000;

    const control_calidad = [
      {
        fecha_control_calidad: fechaControlCalidad,
        hora_control_calidad: horaControlCalidad,
        turno_control_calidad: shiftQualityControl,
        molino_control_calidad: molinoControlCalidad,
        referencia_control_calidad: referenceQualityControl,
        bulto_control_calidad: bulkQualityControl,
        rechazado_control_calidad: rechazadoControlCalidad,
        retencion_control_calidad: retencionControlCalidad,
        observacion_control_calidad: observacionControlCalidad,
      },
    ];
    try {
      await axios.post(
        `http://${localIP}:3000/controles_calidad`,
        control_calidad
      );
      await axios.post(`http://${localIP}:3000/productos_rechazados`, {
        nombre_producto_rechazado: referenceQualityControl,
        cantidad_producto_rechazado: cantidadProductoRechazado,
        retencion_producto_rechazado: retencionControlCalidad,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al crear el control de calidad. Por favor, inténtelo de nuevo.`
        );
        setLoading(false);
      }
    }
  };
  const molinoSeleccionado = molino.find(
    (item) => item.name === molinoControlCalidad
  );
  const redirectReport = () => {
    navigate("/generatereport/generatereportmenu");
  };

  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateQualityControlFormAlternative}
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
              className={Style.generateQualityControlFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : currentData.length > 0 ? (
            <>
              {sendStatus === true ? (
                <motion.div
                  className={Style.generateQualityControlFormAlternative}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1>Control de calidad creado con éxito</h1>
                </motion.div>
              ) : (
                <motion.form
                  className={Style.generateQualityControlForm}
                  onSubmit={sendCreate}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <header className={Style.generateQualityControlFormHeader}>
                    <h1>
                      Selecciona el molino al que va a realizar el control de
                      calidad y complete los datos
                    </h1>
                  </header>
                  <main className={Style.generateQualityControlFormMain}>
                    <table
                      className={Style.generateQualityControlFormMainTable}
                    >
                      <thead
                        className={
                          Style.generateQualityControlFormMainTableHead
                        }
                      >
                        <tr>
                          <th>Referencia</th>
                          <th>Bulto</th>
                        </tr>
                      </thead>
                      <tbody
                        className={
                          Style.generateQualityControlFormMainTableBody
                        }
                      >
                        <tr>
                          <td>
                            {molinoSeleccionado?.reference || "No seleccionado"}
                          </td>
                          <td>
                            {molinoSeleccionado?.bulk || "No seleccionado"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <fieldset>
                      <label htmlFor="molinoControlCalidad">Molino</label>
                      <select
                        id="molinoControlCalidad"
                        name="molinoControlCalidad"
                        value={molinoControlCalidad}
                        onChange={(e) =>
                          setMolinoControlCalidad(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Selecciona un molino
                        </option>
                        {molino
                          .filter((item) => !item.isInParo)
                          .map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      {validationError.molinoControlCalidad && (
                        <motion.span
                          className={Style.generateQualityControlFormValidation}
                          initial={{ zoom: 0 }}
                          animate={{ zoom: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {validationError.molinoControlCalidad}
                        </motion.span>
                      )}
                    </fieldset>
                    <div
                      className={
                        Style.generateQualityControlFormMainAlternative
                      }
                    >
                      <fieldset>
                        <label htmlFor="rechazadoControlCalidad">
                          Cantidad de bultos rechazados
                        </label>
                        <input
                          id="rechazadoControlCalidad"
                          name="rechazadoControlCalidad"
                          type="text"
                          placeholder="Ingrese la cantidad de bultos rechazados"
                          value={rechazadoControlCalidad}
                          onChange={(e) =>
                            setRechazadoControlCalidad(e.target.value)
                          }
                        />
                        {!validationError.rechazadoControlCalidad ? (
                          <></>
                        ) : (
                          <motion.span
                            className={
                              Style.generateNoveltyStrikeStartFormValidation
                            }
                            initial={{ zoom: 0 }}
                            animate={{ zoom: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {validationError.rechazadoControlCalidad}
                          </motion.span>
                        )}
                      </fieldset>
                      <fieldset>
                        <label htmlFor="retencionControlCalidad">
                          Retención
                        </label>
                        <input
                          id="retencionControlCalidad"
                          name="retencionControlCalidad"
                          type="text"
                          placeholder="Ingrese la retención obtenida"
                          value={retencionControlCalidad}
                          onChange={(e) =>
                            setRetencionControlCalidad(e.target.value)
                          }
                        />
                        {!validationError.retencionControlCalidad ? (
                          <></>
                        ) : (
                          <motion.span
                            className={
                              Style.generateNoveltyStrikeStartFormValidation
                            }
                            initial={{ zoom: 0 }}
                            animate={{ zoom: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {validationError.retencionControlCalidad}
                          </motion.span>
                        )}
                      </fieldset>
                    </div>
                    <fieldset>
                      <label htmlFor="observacionControlCalidad">
                        Observación
                      </label>
                      <input
                        id="observacionControlCalidad"
                        name="observacionControlCalidad"
                        type="text"
                        placeholder="Ingresa una observación"
                        value={observacionControlCalidad}
                        onChange={(e) =>
                          setObservacionControlCalidad(e.target.value)
                        }
                      />
                      {!validationError.observacionControlCalidad ? (
                        <></>
                      ) : (
                        <motion.span
                          className={
                            Style.generateNoveltyStrikeStartFormValidation
                          }
                          initial={{ zoom: 0 }}
                          animate={{ zoom: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {validationError.observacionControlCalidad}
                        </motion.span>
                      )}
                    </fieldset>
                  </main>
                  <footer className={Style.generateQualityControlFormFooter}>
                    <button onClick={redirectReport} type="button">
                      Cancelar
                    </button>
                    <button type="submit">
                      {loading ? (
                        <div className={Style.loader}></div>
                      ) : (
                        "Crear control de calidad"
                      )}
                    </button>
                    {!serverError ? (
                      <></>
                    ) : (
                      <motion.span
                        className={
                          Style.generateQualityControlFormValidationServer
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
          ) : (
            <motion.div
              className={Style.generateQualityControlFormAlternative}
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

export default GenerateQualityControlForm;
