import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-component-form.module.css";

function GenerateNoveltyFreighterForm() {
  const [carguero, setCarguero] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [bobCat, setBotCat] = useState([]);
  const [bobCatNovedad, setBobCatNovedad] = useState("");
  const [cargueroNovedad, setCargueroNovedad] = useState("");
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
        const responseBobCat = await axios.get(
          `http://${localIP}:3000/bob_cats`,
        );
        const bobCats = responseBobCat.data;

        // noinspection HttpUrlsUsage
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
          compareTime(currentTime, shift.inicio_turno, shift.fin_turno),
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
            currentTime.getDate() - 1,
          );
        }

        const {
          nombre_turno: turno,
          inicio_turno: inicioTurno,
          fin_turno: finTurno,
        } = currentShift;

        // noinspection HttpUrlsUsage
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          },
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;

        const combinedData = bobCats.map((bobCat) => {
          const report = reports
            .filter(
              (report) =>
                report.bob_cat_informe_inicial === bobCat.nombre_bob_cat,
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial),
            )[0];

          const novelty = news
            .filter(
              (novelty) => novelty.bob_cat_novedad === bobCat.nombre_bob_cat,
            )
            .sort(
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

          return {
            name: bobCat.nombre_bob_cat,
            carguero:
              recent?.carguero_informe_inicial ||
              recent?.carguero_novedad ||
              "",
          };
        });

        setCurrentData(reports);
        setFinalData(endReports);
        setBotCat(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP]);

  useEffect(() => {
    const getUser = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.post(
          `http://${localIP}:3000/usuarios/informeinicialusuario`,
          { idPerfil: 8 },
        );

        setCarguero(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };

    void getUser();
  }, [localIP]);

  const validation = () => {
    const errors = {};

    if (!bobCatNovedad.trim()) {
      errors.bobCatNovedad = "El bob - cat es obligatorio.";
    }
    if (!cargueroNovedad.trim()) {
      errors.cargueroNovedad = "El operador del minicargador es obligatorio.";
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

    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Cambio de operador de minicargador",
        bob_cat_novedad: bobCatNovedad,
        carguero_novedad: cargueroNovedad,
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
          `Error al crear el cambio de operador de minicargador. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/noveltyoption");
  };

  // noinspection JSValidateTypes
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
              <h1>Operador de minicargador cambiado con éxito</h1>
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
                <h1>
                  Complete los datos para cambiar el operador del minicargador
                </h1>
              </header>
              <main className={Style.generateNoveltyComponentFormMain}>
                <fieldset>
                  <label htmlFor="bobCatNovedad">Seleccione un bob - cat</label>
                  <select
                    id="bobCatNovedad"
                    name="bobCatNovedad"
                    value={bobCatNovedad}
                    onChange={(e) => setBobCatNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un bob - cat
                    </option>
                    {bobCat.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {!validationError.bobCatNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyComponentFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.bobCatNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <div
                  className={Style.generateNoveltyComponentFormMainAlternative}
                >
                  <fieldset>
                    <label htmlFor="cargueroNovedad">
                      Operador de minicargador
                    </label>
                    <select
                      id="cargueroNovedad"
                      name="cargueroNovedad"
                      onChange={(e) => setCargueroNovedad(e.target.value)}
                      value={cargueroNovedad}
                    >
                      <option value="" disabled>
                        Seleccione un operador de minicargador
                      </option>
                      {carguero.map((carguero) => (
                        <option
                          key={carguero.id_usuario}
                          value={carguero.id_usuario}
                        >
                          {carguero.nombre_usuario}
                        </option>
                      ))}
                    </select>
                    {!validationError.cargueroNovedad ? (
                      <></>
                    ) : (
                      <motion.span
                        className={Style.generateNoveltyComponentFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.cargueroNovedad}
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
                    "Cambiar operador de minicargador"
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

export default GenerateNoveltyFreighterForm;
