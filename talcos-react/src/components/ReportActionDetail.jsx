import { es } from "date-fns/locale";
import {
  addDays,
  differenceInMinutes,
  format,
  parse,
  parseISO,
} from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Style from "./styles/report-action-detail.module.css";

function ReportActionDetail({ item, shift }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  const startReport = item?.filter((item) => item.id_informe_inicial);
  const windmill =
    startReport?.filter((item) => item.molino_informe_inicial) || [];
  const bobCat = startReport?.filter((item) => item.bob_cat_informe_inicial);
  const news = item?.filter((item) => item.id_novedad);
  const windmillOn =
    news?.filter((item) => item.tipo_novedad === "Encendido de molino") || [];
  const windmillStrikes =
    news?.filter((item) => item.tipo_novedad === "Paro") || [];
  const mechanic =
    news?.filter((item) => item.tipo_novedad === "Adición de mecánico") || [];
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
  const cdcHtml = startReport
    .filter((informe) => informe?.cdc?.nombre_usuario)
    .map((informe) => `<p>${informe.cdc.nombre_usuario}</p>`)
    .join("");
  const mecanicosHtml = [
    ...startReport
      .filter((informe) => informe?.mecanico?.nombre_usuario)
      .map((informe) => `<p>${informe.mecanico.nombre_usuario}</p>`),
    ...mechanic
      .filter((novedad) => novedad?.mecanico?.nombre_usuario)
      .map((novedad) => `<p>${novedad.mecanico.nombre_usuario}</p>`),
  ].join("");
  const formatTime = (time) => {
    if (!time) return "";

    return time.slice(0, 5);
  };

  const startReportHTML = `
    <table class="table">
      <caption>
        <h2>Informe inicial </h2>
        <span>
          Hora de registro: ${formatTime(startReport[0]?.hora_informe_inicial)}
        </span>
      </caption>
      <thead class="tableHead">
        <tr>
          <th>Molino</th>
          <th>Referencia</th>
          <th>Bulto</th>
          <th>Horómetro inicial</th>
          <th>Operador de molino</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        ${windmill
          .map(
            (item) => `
          <tr>
            <td>${item.molino_informe_inicial}</td>
            <td>${item.referencia_informe_inicial}</td>
            <td>${item.bulto_informe_inicial}</td>
            <td>${item.horometro_informe_inicial} Hrs</td>
            <td>${item.operador?.nombre_usuario}</td>
          </tr>`
          )
          .join("")}
        <tr>
          <th colSpan="2">Bob - Cat</th>
          <th colSpan="3">Operador de minicargador</th>
        </tr>
        ${bobCat
          .map(
            (item) => `
          <tr>
            <td colSpan="2">${item.bob_cat_informe_inicial}</td>
            <td colSpan="3">${item.carguero?.nombre_usuario}</td>
          </tr>`
          )
          .join("")}
      </tbody>
      <tfoot class="tableFooter">
        <tr>
          <th colSpan="5">Observaciones</th>
        </tr>
        <tr>
          <td colSpan="5">
            ${
              startReport[0]?.observacion_informe_inicial !== ""
                ? startReport[0]?.observacion_informe_inicial
                : "No se registró"
            }
          </td>
        </tr>
      </tfoot>
    </table>`;
  const newsHTML = news
    .map((item) => {
      switch (item.tipo_novedad) {
        case "Paro":
          return `
            <table class="table">
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Molino</th>
                  <th>Hora de inicio</th>
                  <th>Hora de finalización</th>
                  <th>Horómetro inicial</th>
                  <th>Horómetro final</th>
                  <th>Tipo de paro</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.molino_novedad}</td>
                  <td>${formatTime(item.inicio_paro_novedad)}</td>
                  <td>
                    ${
                      item.fin_paro_novedad
                        ? formatTime(item.fin_paro_novedad)
                        : formatTime(shift?.fin_turno)
                    }
                  </td>
                  <td>${item.horometro_inicio_paro_novedad} Hrs</td>
                  <td>${
                    item.horometro_fin_paro_novedad
                      ? item.horometro_fin_paro_novedad + " Hrs"
                      : "No definido"
                  }
                  </td>
                  <td>${item.motivo_paro_novedad}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="6">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="6">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        case "Cambio de referencia":
          return `
            <table
              class="table"
            >
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Molino</th>
                  <th>Referencia</th>
                  <th>Bulto</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.molino_novedad}</td>
                  <td>${item.referencia_novedad}</td>
                  <td>${item.bulto_novedad}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="3">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="3">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        case "Cambio de operador de molino":
          return `
            <table class="table">
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Molino</th>
                  <th>Operador de molino</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.molino_novedad}</td>
                  <td>${item.operador?.nombre_usuario}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="2">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="2">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        case "Cambio de operador de minicargador":
          return `
            <table class="table">
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Bob - Cat</th>
                  <th>Operador de minicargador</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.bob_cat_novedad}</td>
                  <td>${item.carguero?.nombre_usuario}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="2">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="2">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        case "Adición de mecánico":
          return `
            <table
              class ="table"
            >
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Mecánico</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.mecanico?.nombre_usuario}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="1">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="1">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        case "Encendido de molino":
          return `
            <table
              class="table"
            >
              <caption>
                <h2>Novedad - ${item.tipo_novedad}</h2>
                <span>Hora de registro: ${formatTime(item?.hora_novedad)}</span>
              </caption>
              <thead class="tableHead">
                <tr>
                  <th>Molino</th>
                  <th>Referencia</th>
                  <th>Bulto</th>
                  <th>Horómetro inicial</th>
                  <th>Operador de molino</th>
                </tr>
              </thead>
              <tbody class="tableBody">
                <tr>
                  <td>${item.molino_novedad}</td>
                  <td>${item.referencia_novedad}</td>
                  <td>${item.bulto_novedad}</td>
                  <td>
                    ${
                      item.horometro_inicio_paro_novedad ||
                      item.horometro_fin_paro_novedad
                    }${" "}
                    Hrs
                  </td>
                  <td>${item.operador?.nombre_usuario}</td>
                </tr>
              </tbody>
              <tfoot class="tableFooter">
                <tr>
                  <th colSpan="5">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="5">
                    ${
                      item.observacion_novedad !== ""
                        ? item.observacion_novedad
                        : "No se registró"
                    }
                  </td>
                </tr>
              </tfoot>
            </table>`;
          break;
        default:
          break;
      }
    })
    .join("");
  const qualityControlHTML =
    qualityControl.length > 0
      ? `
    <table class="table">
      <caption>
        <h2>Control de calidad </h2>
      </caption>
      <thead class="tableHead">
        <tr>
          <th>Molino</th>
          <th>Hora de control</th>
          <th>Referencia</th>
          <th>Bulto</th>
          <th>Retención máxima</th>
          <th>Bultos rechazados</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        ${qualityControl
          .map(
            (item) => `
          <tr>
            <td>${item.molino_control_calidad}</td>
            <td>${formatTime(item.hora_control_calidad)}</td>
            <td>${item.referencia_control_calidad}</td>
            <td>${item.bulto_control_calidad}</td>
            <td>${item.retencion_control_calidad}</td>
            <td>${item.rechazado_control_calidad}</td>
          </tr>`
          )
          .join("")}
      </tbody>
      <tfoot class="tableFooter">
        <tr>
          <th colSpan="6">Observaciones</th>
        </tr>
        <tr>
          <td colSpan="6">
            ${
              qualityControl[0]?.observacion_control_calidad !== ""
                ? qualityControl[0]?.observacion_control_calidad
                : "No se registró"
            }
          </td>
        </tr>
      </tfoot>
    </table>`
      : ``;
  const endReportHTML = `
    <table
      class="table"
    >
      <caption>
        <h2>Informe final </h2>
        <span>
          Hora de registro: ${formatTime(endReport[0]?.hora_informe_final)}
        </span>
      </caption>
      <thead class="tableHead">
        <tr>
          <th>Molino</th>
          <th>Referencia</th>
          <th>Bulto</th>
          <th>Cantidad</th>
          <th>Horómetro final</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        ${endReport
          .map(
            (item) => `
          <tr>
            <td>${item.molino_informe_final}</td>
            <td>${item.referencia_informe_final}</td>
            <td>${item.bulto_informe_final}</td>
            <td>${item.cantidad_informe_final} Tons</td>
            <td>${item.horometro_informe_final} Hrs</td>
          </tr>`
          )
          .join("")}
      </tbody>
      <tfoot class="tableFooter">
        <tr>
          <th colSpan="5">Observaciones</th>
        </tr>
        <tr>
          <td colSpan="5">
            ${
              endReport[0]?.observacion_informe_final !== ""
                ? endReport[0]?.observacion_informe_final
                : "No se registró"
            }
          </td>
        </tr>
      </tfoot>
    </table>`;
  const aditionalHTML = `
    <table class="table">
      <caption>
        <h2>Información adicional</h2>
      </caption>
      <thead class="tableHead">
        <tr>
          <th>Molino</th>
          <th>Horas trabajadas</th>
          <th>Horas de paro</th>
          <th>Kilos por hora</th>
          <th>Eficiencia</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        ${windmillTotal
          .map(([inicio, encendido, paros, apagado], index) => {
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
                const inicioParoStr = paro?.inicio_paro_novedad || null;
                const finParoStr = paro?.fin_paro_novedad || shift?.fin_turno;

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
              });
            } else if (paros) {
              const inicioParoStr = paros.inicio_paro_novedad || null;
              const finParoStr = paros.fin_paro_novedad || shift?.fin_turno;

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

              const totalMinutos = differenceInMinutes(horaFinal, horaInicio);
              minutosTrabajados = Math.max(totalMinutos - totalMinutosParo, 0);

              if (minutosTrabajados > 0) {
                const horas = Math.floor(minutosTrabajados / 60);
                const mins = minutosTrabajados % 60;
                horasTrabajadasFormatted = `${horas}:${mins
                  .toString()
                  .padStart(2, "0")}`;
              }
            }

            const kilosTotales = apagado?.cantidad_informe_final * 1000 || 0;
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

              const minutosTurno = differenceInMinutes(finTurno, inicioTurno);
              duracionTurnoHoras = minutosTurno / 60;
            }

            const eficiencia =
              duracionTurnoHoras > 0
                ? ((horasTrabajadasDecimal / duracionTurnoHoras) * 100).toFixed(
                    2
                  )
                : "0";

            return `
            <tr>
              <td>${molino}</td>
              <td>${horasTrabajadasFormatted} Hrs</td>
              <td>${horasParoFormatted} Hrs</td>
              <td>${kilosPorHora} Kg/Hr</td>
              <td>${eficiencia} %</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>`;

  const formatDate = (date) => {
    const formattedDate = format(
      parseISO(date),
      "EEEE dd 'de' MMMM 'del' yyyy",
      {
        locale: es,
      }
    );
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const printItem = async (e) => {
    e.preventDefault();

    const formatDate = (date) => {
      const formattedDate = format(
        parseISO(date),
        "EEEE dd 'de' MMMM 'del' yyyy",
        {
          locale: es,
        }
      );
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    };
    const formatTime = (time) => {
      return time.slice(0, 5);
    };

    const content = `
    <style>
      .aside {
        align-content: flex-start;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10%;
        justify-content: center;
        width: 100%;
      }

      .aside div {
        align-content: flex-start;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 5px;
        justify-content: flex-start;
        width: 30%;
      }

      .aside div h2 {
        color: #696a9e;
        font-size: 1rem;
        margin: 0px;
        text-align: left;
      }

      .aside div p {
        font-size: 1rem;
        margin: 0px;
        text-align: left;
      }

      .aside .asideSpecial {
        width: 70%;
      }

      .table {
        border-collapse: collapse;
        page-break-inside: avoid;
        width: 100%;
      }

      .table caption h2 {
        color: #696a9e;
        font-size: 1rem;
        margin: 0px;
      }

      .table caption span {
        font-size: 1rem;
        margin: 0px;
      }

      .tableHead,
      .tableBody,
      .tableFooter {
        width: 100%;
      }

      .tableHead tr,
      .tableBody tr,
      .tableFooter tr {
        page-break-inside: avoid;
        width: 100%;
      }
        
      .tableHead tr {
        background-color: #696a9e;
        color: #ffffff;
      }
        
      .tableHead tr th {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableBody tr:nth-child(odd) {
        color: #000000;
        background-color: #a4adc5;
      }
        
      .tableBody tr:nth-child(even) {
        color: #000000;
        background-color: #9097b7;
      }

      .tableBody tr th {
        background-color: #696a9e;
        color: #ffffff;
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableBody tr td {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableFooter tr th {
        padding-top: 15px;
        vertical-align: baseline;
        text-align: center;
      }

      .tableFooter tr td {
        font-size: 1rem;
        text-align: left;
        vertical-align: baseline;
        width: 100%;
      }
    </style>
    <aside class="aside">
      <div>
        <h2>Fecha de informe</h2>
        <p>${formatDate(startReport[0]?.fecha_informe_inicial)}</p>
      </div>
      <div>
        <h2>Turno de informe</h2>
        <p>${formatTime(shift?.inicio_turno)} - ${formatTime(
      shift?.fin_turno
    )} (${shift?.nombre_turno})</p>
      </div>
      <div>
        <h2>Supervisor</h2>
        <p>${startReport[0]?.titular?.nombre_usuario}</p>
      </div>
      <div>
        <h2>Control de calidad</h2>
        ${cdcHtml}
      </div>
      <div class="asideSpecial">
        <h2>Mecánicos</h2>
        ${mecanicosHtml}
      </div>
    </aside>
    ${startReportHTML}
    ${newsHTML}
    ${qualityControlHTML}
    ${endReportHTML}
    ${aditionalHTML}
    `;
    try {
      setLoading(true);
      const response = await axios.post(
        `http://${localIP}:3000/pdf`,
        {
          titulo: `Informe de turno`,
          contenido: content,
          nombre: "Informe de turno",
        },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "informe_de_turno.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error al imprimir: ", error);
    }
  };
  const redirectReport = () => {
    navigate("/report/mainreport");
  };

  return (
    <>
      <motion.main
        className={Style.ReportActionDetailMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={Style.ReportActionDetailMainShift}>
          <h2>{formatDate(startReport[0]?.fecha_informe_inicial)}</h2>
          <p>
            {formatTime(shift?.inicio_turno)} - {formatTime(shift?.fin_turno)}
          </p>
        </div>
        <div>
          <h2>Supervisor</h2>
          <p>{startReport[0]?.titular?.nombre_usuario}</p>
        </div>
        <div>
          <h2>Control de calidad</h2>
          {startReport.map(
            (informe) =>
              informe?.cdc?.nombre_usuario && (
                <p key={informe.id_informe_inicial}>
                  {informe.cdc.nombre_usuario}
                </p>
              )
          )}
        </div>
        <div>
          <h2>Mecánicos</h2>
          {startReport.map(
            (informe) =>
              informe?.mecanico?.nombre_usuario && (
                <p key={informe.id_informe_inicial}>
                  {informe.mecanico.nombre_usuario}
                </p>
              )
          )}
          {mechanic.map(
            (novedad) =>
              novedad?.mecanico?.nombre_usuario && (
                <p key={novedad.id_novedad}>
                  {novedad.mecanico.nombre_usuario}
                </p>
              )
          )}
        </div>
      </motion.main>
      <motion.footer
        className={Style.ReportActionDetailFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button" onClick={printItem}>
          {loading ? <div className={Style.loader}></div> : "Imprimir informe"}
        </button>
        <button type="button" onClick={redirectReport}>
          Volver
        </button>
      </motion.footer>
    </>
  );
}

export default ReportActionDetail;
