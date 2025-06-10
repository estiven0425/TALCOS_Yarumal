const tablaStore = {};

export const registrarTabla = (id, tablaHtml) => {
  tablaStore[id] = tablaHtml;
};

export const obtenerTodasLasTablas = () => {
  return { ...tablaStore };
};

export const limpiarTablas = () => {
  Object.keys(tablaStore).forEach((key) => delete tablaStore[key]);
};
