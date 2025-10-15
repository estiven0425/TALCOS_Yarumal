import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-final-report-form.module.css";

function GenerateFinishReportForm() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [molinoInformeFinal, setMolinoInformeFinal] = useState({});
  const [observacionInformeFinal, setObservacionInformeFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const [sendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const oldData = location.state || null;
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
    const initialMolinoData = {};

    molino.forEach((item) => {
      initialMolinoData[item.name] = {
        horometro_informe_final: "",
      };

      item.referenceHistory.forEach((history) => {
        const key = `${history.reference}_${history.bulk}`;
        initialMolinoData[item.name][key] = {
          cantidad_informe_final: "",
        };
      });
    });

    setMolinoInformeFinal(initialMolinoData);
  }, [molino]);

  useEffect(() => {
    const getData = async () => {
      if (!oldData?.fecha || !oldData?.turno || !oldData?.finTurno) {
        console.error(
          "No se recibieron fecha, turno u hora de finalización en el estado.",
        );

        setLoadingAlternative(false);

        return;
      }

      try {
        // noinspection HttpUrlsUsage
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;

        // noinspection HttpUrlsUsage
        const responseBulks = await axios.get(`http://${localIP}:3000/bultos`);
        const bulks = responseBulks.data;

        // noinspection HttpUrlsUsage
        const responseReferences = await axios.get(
          `http://${localIP}:3000/referencias`,
        );
        const references = responseReferences.data;

        // noinspection HttpUrlsUsage
        const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShifts.data;

        // noinspection HttpUrlsUsage
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: oldData.fecha,
              turno: oldData.turno,
              inicioTurno: shifts.find(
                (shift) => shift.nombre_turno === oldData.turno,
              )?.inicio_turno,
              finTurno: oldData.finTurno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: oldData.fecha,
              turno: oldData.turno,
              inicioTurno: shifts.find(
                (shift) => shift.nombre_turno === oldData.turno,
              )?.inicio_turno,
              finTurno: oldData.finTurno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
          {
            params: {
              fecha: oldData.fecha,
              turno: oldData.turno,
              inicioTurno: shifts.find(
                (shift) => shift.nombre_turno === oldData.turno,
              )?.inicio_turno,
              finTurno: oldData.finTurno,
            },
          },
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;

        const combinedData = mills
          .map((molino) => {
            const initialRecord =
              reports.find(
                (report) =>
                  report.molino_informe_inicial === molino.nombre_molino,
              ) ||
              news.find(
                (novelty) =>
                  novelty.molino_novedad === molino.nombre_molino &&
                  novelty.tipo_novedad === "Encendido de molino",
              );

            if (!initialRecord) return null;

            const referenceChanges = news
              .filter(
                (novelty) =>
                  novelty.molino_novedad === molino.nombre_molino &&
                  novelty.tipo_novedad === "Cambio de referencia",
              )
              .map((novelty) => ({
                reference: novelty.referencia_novedad,
                bulk: novelty.bulto_novedad,
                capacity:
                  bulks.find((b) => b.nombre_bulto === novelty.bulto_novedad)
                    ?.capacidad_bulto || "No disponible",
                timestamp: new Date(
                  novelty.fecha_novedad + " " + novelty.hora_novedad,
                ),
              }));

            const groupedReferenceHistory = [];

            const allReferenceRecords = [
              {
                reference:
                  initialRecord.referencia_informe_inicial ||
                  initialRecord.referencia_novedad ||
                  "No disponible",
                bulk:
                  initialRecord.bulto_informe_inicial ||
                  initialRecord.bulto_novedad ||
                  "No disponible",
                capacity:
                  bulks.find(
                    (b) =>
                      b.nombre_bulto ===
                      (initialRecord.bulto_informe_inicial ||
                        initialRecord.bulto_novedad),
                  )?.capacidad_bulto || "No disponible",
                timestamp: new Date(
                  initialRecord.fecha_informe_inicial +
                    " " +
                    initialRecord.hora_informe_inicial,
                ),
              },
              ...referenceChanges.sort((a, b) => a.timestamp - b.timestamp),
            ];

            allReferenceRecords.forEach((record) => {
              const existingGroup = groupedReferenceHistory.find(
                (g) =>
                  g.reference === record.reference && g.bulk === record.bulk,
              );

              if (!existingGroup) {
                groupedReferenceHistory.push({
                  reference: record.reference,
                  bulk: record.bulk,
                  capacity: record.capacity,
                  timestamps: [record.timestamp],
                });
              } else {
                existingGroup.timestamps.push(record.timestamp);
              }
            });

            const referenceHistory = groupedReferenceHistory;

            return {
              id: molino.id_molino,
              name: molino.nombre_molino,
              referenceHistory,
            };
          })
          .filter(Boolean);

        setCurrentData(reports);
        setFinalData(endReports);
        setMolino(combinedData);
        setReferencia(references);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP, oldData.fecha, oldData.finTurno, oldData.turno]);

  const handleChange = (molino, reference, field, value) => {
    setMolinoInformeFinal((prevData) => {
      const updatedMolinoData = { ...prevData[molino] };

      if (reference === "" && field === "horometro_informe_final") {
        updatedMolinoData[field] = value;
      } else {
        updatedMolinoData[reference] = {
          ...updatedMolinoData[reference],
          [field]: value,
        };
      }

      return {
        ...prevData,
        [molino]: updatedMolinoData,
      };
    });
  };

  const handleChangeHorometro = (molinoName, value) => {
    setMolinoInformeFinal((prevData) => ({
      ...prevData,
      [molinoName]: {
        ...prevData[molinoName],
        horometro_informe_final: value,
      },
    }));
  };

  const validation = () => {
    const errors = {};

    Object.entries(molinoInformeFinal).forEach(([molino, references]) => {
      if (
        !references.horometro_informe_final ||
        references.horometro_informe_final.trim() === ""
      ) {
        errors[`${molino}-horometro`] =
          `El horómetro del ${molino} es obligatorio.`;
      } else if (isNaN(references.horometro_informe_final)) {
        errors[`${molino}-horometro`] =
          `El horómetro del ${molino} debe ser un número válido.`;
      }

      // noinspection JSCheckFunctionSignatures
      Object.entries(references).forEach(([reference, data]) => {
        if (reference !== "horometro_informe_final") {
          if (
            !data.cantidad_informe_final ||
            data.cantidad_informe_final.trim() === ""
          ) {
            errors[`${molino}-${reference}-cantidad`] =
              `La cantidad de ${reference} producido por el ${molino} es obligatorio.`;
          } else if (isNaN(data.cantidad_informe_final)) {
            errors[`${molino}-${reference}-cantidad`] =
              `La cantidad de ${reference} producido por el ${molino} debe ser un número válido.`;
          }
        }
      });
    });

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };

  const sendCreate = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    const horometrosMolinos = [];

    Object.entries(molinoInformeFinal).forEach(([molinoName, data]) => {
      if (
        data.horometro_informe_final &&
        data.horometro_informe_final.trim() !== ""
      ) {
        const matchingWindmill = molino.find(
          (item) => item.name === molinoName,
        );

        if (matchingWindmill) {
          horometrosMolinos.push({
            id_molino: matchingWindmill.id,
            horometro_molino: parseInt(data.horometro_informe_final),
          });
        }
      }
    });

    const cantidadesReferencias = [];

    Object.entries(molinoInformeFinal).forEach(
      ([molinoName, referencesData]) => {
        // noinspection JSCheckFunctionSignatures
        Object.entries(referencesData).forEach(([referenceName, data]) => {
          if (
            referenceName !== "horometro_informe_final" &&
            data.cantidad_informe_final &&
            data.cantidad_informe_final.trim() !== ""
          ) {
            const matchingWindmill = molino.find(
              (item) => item.name === molinoName,
            );

            const matchingReference = referencia.find(
              (ref) => ref.nombre_referencia === referenceName,
            );

            if (matchingWindmill && matchingReference) {
              const cantidadProducido =
                (matchingWindmill.referenceHistory.find(
                  (hist) => hist.reference === referenceName,
                )?.capacity *
                  parseInt(data.cantidad_informe_final)) /
                1000;

              cantidadesReferencias.push({
                id_referencia: matchingReference.id_referencia,
                cantidad_referencia: cantidadProducido,
              });
            }
          }
        });
      },
    );

    const informeFinalArray = [];

    Object.entries(molinoInformeFinal).forEach(([molinoName, references]) => {
      const horometro = references.horometro_informe_final;

      Object.entries(references).forEach(([key, data]) => {
        if (
          key !== "horometro_informe_final" &&
          data.cantidad_informe_final &&
          data.cantidad_informe_final.trim() !== ""
        ) {
          const [referenceName, bulkName] = key.split("_");

          const matchingWindmill = molino.find(
            (item) => item.name === molinoName,
          );

          const cantidadProducido =
            (matchingWindmill?.referenceHistory.find(
              (hist) =>
                hist.reference === referenceName && hist.bulk === bulkName,
            )?.capacity *
              parseInt(data.cantidad_informe_final)) /
            1000;

          informeFinalArray.push({
            fecha_informe_final: oldData.fecha,
            hora_informe_final: oldData.finTurno,
            turno_informe_final: oldData.turno,
            molino_informe_final: molinoName,
            referencia_informe_final: referenceName,
            bulto_informe_final: bulkName,
            cantidad_informe_final: cantidadProducido,
            horometro_informe_final: horometro,
            observacion_informe_final: observacionInformeFinal,
          });
        }
      });
    });

    try {
      // noinspection HttpUrlsUsage
      await axios.put(
        `http://${localIP}:3000/molinos/actualizarhorometro`,
        horometrosMolinos,
      );
      // noinspection HttpUrlsUsage
      await axios.put(
        `http://${localIP}:3000/referencias/actualizarcantidad`,
        cantidadesReferencias,
      );
      // noinspection HttpUrlsUsage
      await axios.post(
        `http://${localIP}:3000/informes_finales`,
        informeFinalArray,
      );

      setSendStatus(true);
    } catch (error) {
      if (error.response?.data?.error) {
        setServerError(error.response.data.error);
      } else {
        setServerError("Error al enviar el informe final. Inténtelo de nuevo.");
      }
      setLoading(false);
    }
  };

  const redirectReport = () => {
    navigate("/generatereport/generatereportmenu");
  };

  // noinspection JSValidateTypes
  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateFinalReportFormAlternative}
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
              className={Style.generateFinalReportFormAlternative}
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
                  className={Style.generateFinalReportFormAlternative}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1>Informe finalizado con éxito</h1>
                </motion.div>
              ) : (
                <motion.form
                  className={Style.generateFinalReportForm}
                  onSubmit={sendCreate}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <header className={Style.generateFinalReportFormHeader}>
                    <h1>
                      Ingrese la cantidad de bultos producidos por cada molino
                    </h1>
                  </header>
                  <main className={Style.generateFinalReportFormMain}>
                    <table className={Style.generateFinalReportFormMainTable}>
                      <thead
                        className={Style.generateFinalReportFormMainTableHead}
                      >
                        <tr>
                          <th>Molino</th>
                          <th>Referencia</th>
                          <th>Bulto</th>
                        </tr>
                      </thead>
                      <tbody
                        className={Style.generateFinalReportFormMainTableBody}
                      >
                        {molino.map((item, index) =>
                          item.referenceHistory.map((history, subIndex) => (
                            <tr key={`${index}-${subIndex}`}>
                              {subIndex === 0 && (
                                <td rowSpan={item.referenceHistory.length}>
                                  {item.name}
                                </td>
                              )}
                              <td>{history.reference || "No disponible"}</td>
                              <td>{history.bulk || "No disponible"}</td>
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                    {molino.map((item, index) => {
                      const referencesCount = item.referenceHistory.length;

                      return (
                        <fieldset key={index}>
                          <h2
                            className={
                              Style.generateFinalReportFormMainEspecialAlternative
                            }
                          >
                            {item.name}
                          </h2>

                          {item.referenceHistory.map((history, subIndex) => (
                            <div key={`${index}-${subIndex}`}>
                              <label
                                htmlFor={`cantidad_informe_final-${item.name}-${history.reference}`}
                              >
                                Cantidad ({history.reference} - {history.bulk})
                              </label>
                              <input
                                id={`cantidad_informe_final-${item.name}-${history.reference}-${history.bulk}`}
                                type="text"
                                value={
                                  molinoInformeFinal[item.name]?.[
                                    `${history.reference}_${history.bulk}`
                                  ]?.cantidad_informe_final || ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    item.name,
                                    `${history.reference}_${history.bulk}`,
                                    "cantidad_informe_final",
                                    e.target.value,
                                  )
                                }
                                placeholder="Ingrese la cantidad de bultos producidos"
                              />
                              {validationError[
                                `${item.name}-${history.reference}-cantidad`
                              ] && (
                                <motion.span
                                  className={
                                    Style.generateFinalReportFormValidation
                                  }
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {
                                    validationError[
                                      `${item.name}-${history.reference}-cantidad`
                                    ]
                                  }
                                </motion.span>
                              )}
                            </div>
                          ))}
                          <div
                            className={
                              referencesCount % 2 === 0
                                ? Style.generateFinalReportFormMainEspecialAlternative
                                : ""
                            }
                          >
                            <label
                              htmlFor={`horometro_informe_final-${item.name}`}
                            >
                              Horómetro
                            </label>
                            <input
                              id={`horometro_informe_final-${item.name}`}
                              type="text"
                              value={
                                molinoInformeFinal[item.name]
                                  ?.horometro_informe_final || ""
                              }
                              onChange={(e) =>
                                handleChangeHorometro(item.name, e.target.value)
                              }
                              placeholder="Ingrese el horómetro"
                            />
                            {validationError[`${item.name}-horometro`] && (
                              <motion.span
                                className={
                                  Style.generateFinalReportFormValidation
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {validationError[`${item.name}-horometro`]}
                              </motion.span>
                            )}
                          </div>
                        </fieldset>
                      );
                    })}
                    <div
                      className={Style.generateFinalReportFormMainAlternative}
                    >
                      <fieldset>
                        <label htmlFor="observacionInformeFinal">
                          Observación
                        </label>
                        <input
                          id="observacionInformeFinal"
                          name="observacionInformeFinal"
                          type="text"
                          placeholder="Ingresa una observación"
                          value={observacionInformeFinal}
                          onChange={(e) =>
                            setObservacionInformeFinal(e.target.value)
                          }
                        />
                      </fieldset>
                    </div>
                  </main>
                  <footer className={Style.generateFinalReportFormFooter}>
                    <button onClick={redirectReport} type="button">
                      Cancelar
                    </button>
                    <button type="submit">
                      {loading ? (
                        <div className={Style.loader}></div>
                      ) : (
                        "Finalizar informe"
                      )}
                    </button>
                    {!serverError ? (
                      <></>
                    ) : (
                      <motion.span
                        className={
                          Style.generateFinalReportFormValidationServer
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
              className={Style.generateFinalReportFormAlternative}
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

export default GenerateFinishReportForm;
