const tablaStore = {};

export const registrarTabla = (id, tablaHtml) => {
  tablaStore[id] = tablaHtml;
};

export const obtenerTodasLasTablas = () => {
  return { ...tablaStore };
};
