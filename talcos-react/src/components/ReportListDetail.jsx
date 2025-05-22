import { motion } from "framer-motion";
import { addDays, parse, differenceInMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReportActionDetail from "./ReportActionDetail";
import axios from "axios";
import Style from "./styles/report-list-detail.module.css";

function ReportListDetail() {
  const [item, setItem] = useState(null);
  const [shift, setShift] = useState([]);
  const location = useLocation();
  const data = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);
  useEffect(() => {
    const getShifts = async () => {
      if (!item) return;

      try {
        const responseShift = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShift.data;
        const shift = shifts?.find(
          (shift) => shift.nombre_turno === item[0]?.turno_informe_inicial
        );

        setShift(shift);
      } catch (error) {
        console.error("Error al obtener el turno:", error);
      }
    };

    getShifts();
  }, [localIP, item]);

  const startReport = item?.filter((item) => item.id_informe_inicial);
  const windmill =
    startReport?.filter((item) => item.molino_informe_inicial) || [];
  const bobCat = startReport?.filter((item) => item.bob_cat_informe_inicial);
  const news = item?.filter((item) => item.id_novedad);
  const windmillOn =
    news?.filter((item) => item.tipo_novedad === "Encendido de molino") || [];
  const windmillStrikes =
    news?.filter((item) => item.tipo_novedad === "Paro") || [];
  const qualityControl = item?.filter((item) => item.id_control_calidad);
  const endReport = item?.filter((item) => item.id_informe_final) || [];
  const windmillTotal = [];
  const allMolinos = new Set([
    ...windmill.map((windmill) => windmill.molino_informe_inicial),
    ...windmillOn.map((windmill) => windmill.molino_novedad),
    ...windmillStrikes.map((item) => item.molino_novedad),
    ...endReport.map((windmill) => windmill.molino_informe_final),
  ]);

  allMolinos.forEach((molino) => {
    const inicio =
      windmill.find((windmill) => windmill.molino_informe_inicial === molino) ||
      null;
    const encendido =
      windmillOn.find((windmill) => windmill.molino_novedad === molino) || null;
    const paros = windmillStrikes.filter(
      (item) => item.molino_novedad === molino
    );
    const apagado =
      endReport.find((windmill) => windmill.molino_informe_final === molino) ||
      null;

    windmillTotal.push([inicio, encendido, paros, apagado]);
  });

  const formatTime = (time) => {
    if (!time) return "";

    return time.slice(0, 5);
  };

  return (
    <>
      {item ? (
        <>
          <motion.section
            className={Style.reportListDetailPrimary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {startReport.length > 0 ? (
              <motion.table
                className={Style.reportListDetailPrimaryTable}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <caption>
                  <h2>Informe inicial </h2>
                  <span>
                    Hora de registro:{" "}
                    {formatTime(startReport[0]?.hora_informe_inicial)}
                  </span>
                </caption>
                <thead className={Style.reportListDetailPrimaryTableHead}>
                  <tr>
                    <th>Molino</th>
                    <th>Referencia</th>
                    <th>Bulto</th>
                    <th>Horómetro inicial</th>
                    <th>Operador de molino</th>
                  </tr>
                </thead>
                <tbody className={Style.reportListDetailPrimaryTableBody}>
                  {windmill.map((item) => (
                    <tr key={item.id_informe_inicial}>
                      <td>{item.molino_informe_inicial}</td>
                      <td>{item.referencia_informe_inicial}</td>
                      <td>{item.bulto_informe_inicial}</td>
                      <td>{item.horometro_informe_inicial} Hrs</td>
                      <td>{item.operador?.nombre_usuario}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan="2">Bob - Cat</th>
                    <th colSpan="3">Operador de minicargador</th>
                  </tr>
                  {bobCat.map((item) => (
                    <tr key={item.id_informe_inicial}>
                      <td colSpan="2">{item.bob_cat_informe_inicial}</td>
                      <td colSpan="3">{item.carguero?.nombre_usuario}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={Style.reportListDetailPrimaryTableFooter}>
                  <tr>
                    <th colSpan="5">Observaciones</th>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      {startReport[0].observacion_informe_inicial !== ""
                        ? startReport[0].observacion_informe_inicial
                        : "No se registró"}
                    </td>
                  </tr>
                </tfoot>
              </motion.table>
            ) : (
              <></>
            )}
            {news.map((item) => {
              switch (item.tipo_novedad) {
                case "Paro":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="6" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Molino</th>
                          <th>Hora de inicio</th>
                          <th>Hora de finalización</th>
                          <th>Horómetro inicial</th>
                          <th>Horómetro final</th>
                          <th>Tipo de paro</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.molino_novedad}</td>
                          <td>{formatTime(item.inicio_paro_novedad)}</td>
                          <td>
                            {item.fin_paro_novedad
                              ? formatTime(item.fin_paro_novedad)
                              : formatTime(shift?.fin_turno)}
                          </td>
                          <td>{item.horometro_inicio_paro_novedad} Hrs</td>
                          <td>
                            {item.horometro_fin_paro_novedad
                              ? item.horometro_fin_paro_novedad + " Hrs"
                              : "No definido"}
                          </td>
                          <td>{item.motivo_paro_novedad}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="6">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="6">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                case "Cambio de referencia":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="3" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Molino</th>
                          <th>Referencia</th>
                          <th>Bulto</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.molino_novedad}</td>
                          <td>{item.referencia_novedad}</td>
                          <td>{item.bulto_novedad}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="3">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="3">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                case "Cambio de operador de molino":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="2" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Molino</th>
                          <th>Operador de molino</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.molino_novedad}</td>
                          <td>{item.operador?.nombre_usuario}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="2">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                case "Cambio de operador de minicargador":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="2" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Bob - Cat</th>
                          <th>Operador de minicargador</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.bob_cat_novedad}</td>
                          <td>{item.carguero?.nombre_usuario}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="2">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                case "Adición de mecánico":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="1" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Mecánico</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.mecanico?.nombre_usuario}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="1">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="1">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                case "Encendido de molino":
                  return (
                    <motion.table
                      className={Style.reportListDetailPrimaryTable}
                      key={item.id_novedad}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <caption>
                        <h2>Novedad </h2>
                        <span>
                          Hora de registro: {formatTime(item?.hora_novedad)}
                        </span>
                      </caption>
                      <thead className={Style.reportListDetailPrimaryTableHead}>
                        <tr>
                          <th colSpan="5" style={{ fontSize: "1.5rem" }}>
                            {item.tipo_novedad}
                          </th>
                        </tr>
                        <tr>
                          <th>Molino</th>
                          <th>Referencia</th>
                          <th>Bulto</th>
                          <th>Horómetro inicial</th>
                          <th>Operador de molino</th>
                        </tr>
                      </thead>
                      <tbody className={Style.reportListDetailPrimaryTableBody}>
                        <tr>
                          <td>{item.molino_novedad}</td>
                          <td>{item.referencia_novedad}</td>
                          <td>{item.bulto_novedad}</td>
                          <td>
                            {item.horometro_inicio_paro_novedad ||
                              item.horometro_fin_paro_novedad}{" "}
                            Hrs
                          </td>
                          <td>{item.operador?.nombre_usuario}</td>
                        </tr>
                      </tbody>
                      <tfoot
                        className={Style.reportListDetailPrimaryTableFooter}
                      >
                        <tr>
                          <th colSpan="5">Observaciones</th>
                        </tr>
                        <tr>
                          <td colSpan="5">
                            {item.observacion_novedad !== ""
                              ? item.observacion_novedad
                              : "No se registró"}
                          </td>
                        </tr>
                      </tfoot>
                    </motion.table>
                  );
                  break;
                default:
                  break;
              }
            })}
            {qualityControl.length > 0 ? (
              <motion.table
                className={Style.reportListDetailPrimaryTable}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <caption>
                  <h2>Control de calidad </h2>
                </caption>
                <thead className={Style.reportListDetailPrimaryTableHead}>
                  <tr>
                    <th>Molino</th>
                    <th>Hora de control</th>
                    <th>Referencia</th>
                    <th>Bulto</th>
                    <th>Retención máxima</th>
                    <th>Bultos rechazados</th>
                  </tr>
                </thead>
                <tbody className={Style.reportListDetailPrimaryTableBody}>
                  {qualityControl.map((item) => (
                    <tr key={item.id_control_calidad}>
                      <td>{item.molino_control_calidad}</td>
                      <td>{formatTime(item.hora_control_calidad)}</td>
                      <td>{item.referencia_control_calidad}</td>
                      <td>{item.bulto_control_calidad}</td>
                      <td>{item.retencion_control_calidad}</td>
                      <td>{item.rechazado_control_calidad}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={Style.reportListDetailPrimaryTableFooter}>
                  <tr>
                    <th colSpan="6">Observaciones</th>
                  </tr>
                  <tr>
                    <td colSpan="6">
                      {qualityControl[0].observacion_control_calidad !== ""
                        ? qualityControl[0].observacion_control_calidad
                        : "No se registró"}
                    </td>
                  </tr>
                </tfoot>
              </motion.table>
            ) : (
              <></>
            )}
            {endReport.length > 0 ? (
              <motion.table
                className={Style.reportListDetailPrimaryTable}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <caption>
                  <h2>Informe final </h2>
                  <span>
                    Hora de registro:{" "}
                    {formatTime(endReport[0]?.hora_informe_final)}
                  </span>
                </caption>
                <thead className={Style.reportListDetailPrimaryTableHead}>
                  <tr>
                    <th>Molino</th>
                    <th>Referencia</th>
                    <th>Bulto</th>
                    <th>Cantidad</th>
                    <th>Horómetro final</th>
                  </tr>
                </thead>
                <tbody className={Style.reportListDetailPrimaryTableBody}>
                  {endReport.map((item) => (
                    <tr key={item.id_informe_final}>
                      <td>{item.molino_informe_final}</td>
                      <td>{item.referencia_informe_final}</td>
                      <td>{item.bulto_informe_final}</td>
                      <td>{item.cantidad_informe_final} Tons</td>
                      <td>{item.horometro_informe_final} Hrs</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={Style.reportListDetailPrimaryTableFooter}>
                  <tr>
                    <th colSpan="5">Observaciones</th>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      {endReport[0].observacion_informe_final !== ""
                        ? endReport[0].observacion_informe_final
                        : "No se registró"}
                    </td>
                  </tr>
                </tfoot>
              </motion.table>
            ) : (
              <></>
            )}
            {startReport.length > 0 ? (
              <motion.table
                className={Style.reportListDetailPrimaryTable}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <caption>
                  <h2>Información adicional</h2>
                </caption>
                <thead className={Style.reportListDetailPrimaryTableHead}>
                  <tr>
                    <th>Molino</th>
                    <th>Horas trabajadas</th>
                    <th>Horas de paro</th>
                    <th>Kilos por hora</th>
                    <th>Eficiencia</th>
                  </tr>
                </thead>
                <tbody className={Style.reportListDetailPrimaryTableBody}>
                  {windmillTotal.map(
                    ([inicio, encendido, paros, apagado], index) => {
                      const molino =
                        inicio?.molino_informe_inicial ||
                        encendido?.molino_novedad ||
                        apagado?.molino_informe_final ||
                        index + 1;

                      const horaInicioStr =
                        inicio?.hora_informe_inicial || encendido?.hora_novedad;
                      const horaFinalStr = apagado?.hora_informe_final;

                      let totalMinutosParo = 0;
                      if (Array.isArray(paros)) {
                        paros.forEach((paro) => {
                          const inicioParoStr =
                            paro?.inicio_paro_novedad || null;
                          const finParoStr =
                            paro?.fin_paro_novedad || shift?.fin_turno;

                          if (inicioParoStr && finParoStr) {
                            let inicioParo = parse(
                              inicioParoStr.slice(0, 5),
                              "HH:mm",
                              new Date()
                            );
                            let finParo = parse(
                              finParoStr.slice(0, 5),
                              "HH:mm",
                              new Date()
                            );

                            if (finParo < inicioParo) {
                              finParo = addDays(finParo, 1);
                            }

                            const diff = differenceInMinutes(
                              finParo,
                              inicioParo
                            );
                            if (diff > 0) {
                              totalMinutosParo += diff;
                            }
                          }
                        });
                      } else if (paros) {
                        const inicioParoStr = paros.inicio_paro_novedad || null;
                        const finParoStr =
                          paros.fin_paro_novedad || shift?.fin_turno;

                        if (inicioParoStr && finParoStr) {
                          let inicioParo = parse(
                            inicioParoStr.slice(0, 5),
                            "HH:mm",
                            new Date()
                          );
                          let finParo = parse(
                            finParoStr.slice(0, 5),
                            "HH:mm",
                            new Date()
                          );

                          if (finParo < inicioParo) {
                            finParo = addDays(finParo, 1);
                          }

                          const diff = differenceInMinutes(finParo, inicioParo);
                          if (diff > 0) {
                            totalMinutosParo += diff;
                          }
                        }
                      }

                      let horasParoFormatted = "0";
                      if (totalMinutosParo > 0) {
                        const horas = Math.floor(totalMinutosParo / 60);
                        const mins = totalMinutosParo % 60;
                        horasParoFormatted = `${horas}:${mins
                          .toString()
                          .padStart(2, "0")}`;
                      }

                      let horasTrabajadasFormatted = "0";
                      let minutosTrabajados = 0;

                      if (horaInicioStr && horaFinalStr) {
                        let horaInicio = parse(
                          horaInicioStr.slice(0, 5),
                          "HH:mm",
                          new Date()
                        );
                        let horaFinal = parse(
                          horaFinalStr.slice(0, 5),
                          "HH:mm",
                          new Date()
                        );

                        if (horaFinal < horaInicio) {
                          horaFinal = addDays(horaFinal, 1);
                        }

                        const totalMinutos = differenceInMinutes(
                          horaFinal,
                          horaInicio
                        );
                        minutosTrabajados = Math.max(
                          totalMinutos - totalMinutosParo,
                          0
                        );

                        if (minutosTrabajados > 0) {
                          const horas = Math.floor(minutosTrabajados / 60);
                          const mins = minutosTrabajados % 60;
                          horasTrabajadasFormatted = `${horas}:${mins
                            .toString()
                            .padStart(2, "0")}`;
                        }
                      }

                      const kilosTotales =
                        apagado?.cantidad_informe_final * 1000 || 0;
                      const horasTrabajadasDecimal = minutosTrabajados / 60;
                      const kilosPorHora =
                        horasTrabajadasDecimal > 0
                          ? (kilosTotales / horasTrabajadasDecimal).toFixed(2)
                          : "0";

                      const inicioTurnoStr = shift?.inicio_turno;
                      const finTurnoStr = shift?.fin_turno;

                      let duracionTurnoHoras = 0;

                      if (inicioTurnoStr && finTurnoStr) {
                        let inicioTurno = parse(
                          inicioTurnoStr.slice(0, 5),
                          "HH:mm",
                          new Date()
                        );
                        let finTurno = parse(
                          finTurnoStr.slice(0, 5),
                          "HH:mm",
                          new Date()
                        );

                        if (finTurno < inicioTurno) {
                          finTurno = addDays(finTurno, 1);
                        }

                        const minutosTurno = differenceInMinutes(
                          finTurno,
                          inicioTurno
                        );
                        duracionTurnoHoras = minutosTurno / 60;
                      }

                      const eficiencia =
                        duracionTurnoHoras > 0
                          ? (
                              (horasTrabajadasDecimal / duracionTurnoHoras) *
                              100
                            ).toFixed(2)
                          : "0";

                      return (
                        <tr key={index}>
                          <td>{molino}</td>
                          <td>{horasTrabajadasFormatted} Hrs</td>
                          <td>{horasParoFormatted} Hrs</td>
                          <td>{kilosPorHora} Kg/Hr</td>
                          <td>{eficiencia} %</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </motion.table>
            ) : (
              <></>
            )}
          </motion.section>
          <motion.section
            className={Style.reportListSecondary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ReportActionDetail item={item} shift={shift} />
          </motion.section>
        </>
      ) : (
        <motion.section
          className={Style.reportListDetailPrimaryAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.section>
      )}
    </>
  );
}

export default ReportListDetail;
