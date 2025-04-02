import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-strike-star-form.module.css";

function GenerateNoveltyStrikeStarForm() {
  const [currentData, setCurrentData] = useState(null);
  const [oldNovelty, setOldNovelty] = useState(null);
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

        const reports = responseStartReport.data;
        const news = responseNews.data;

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
          const novelty = news
            .filter(
              (novelty) => novelty.molino_novedad === molino.nombre_molino
            )
            .sort(
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
            operator: recent?.operador.nombre_usuario || "No se registró",
          };
        });

        setCurrentData(reports);
        setOldNovelty(news);
        setMolino(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getData();
  }, [localIP]);

  const validation = () => {
    const errors = {};

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
    // setLoading(true);

    const horaNovedad = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const fechaNovedad = determinateDate(currentData);
    const shiftNovelty = determinateShift(currentData);
    const matchingWindmill = molino?.find(
      (item) => item.name === molinoNovedad
    );
    const referenceNovelety = matchingWindmill?.reference || "";
    const bulkNovelty = matchingWindmill?.bulk || "";
    const operatorNovelty =
      matchingWindmill?.operator || "Operador no registrado";
    const fullReport = {
      fecha_novedad: fechaNovedad,
      hora_novedad: horaNovedad,
      turno_novedad: shiftNovelty,
      tipo_novedad: "Paro",
      molino_novedad: molinoNovedad,
      referencia_novedad: referenceNovelety,
      bulto_novedad: bulkNovelty,
      inicio_paro_novedad: inicioParoNovedad,
      fin_paro_novedad: finParoNovedad,
      horometro_inicio_paro_novedad: horometroInicioParoNovedad,
      horometro_fin_paro_novedad: horometroFinParoNovedad,
      motivo_paro_novedad: motivoParoNovedad,
      operador_novedad: operatorNovelty,
      observacion_novedad: observacionNovedad,
    };

    try {
      // await axios.post(`http://${localIP}:3000/informes_iniciales`, fullReport);
      console.log("fullReport", fullReport);
      // setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al crear la novedad. Por favor, inténtelo de nuevo.`
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
          <h1>Novedad creada con éxito</h1>
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
            <h1>Complete los datos para crear la novedad</h1>
          </header>
          <main className={Style.generateInitialReportFormMain}></main>
          <footer className={Style.generateInitialReportFormFooter}>
            <button onClick={() => redirectGenerateReport()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Crear novedad"}
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

export default GenerateNoveltyStrikeStarForm;
