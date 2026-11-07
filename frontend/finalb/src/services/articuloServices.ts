import api from "../api/axios";
import type { ArticuloActivoDto } from "../types/articulo";

export const listarArticulosActivos = (nombre = "") => {
  const filtro = nombre.trim();
  const config = filtro ? { params: { nombre: filtro } } : {};

  return api.get<ArticuloActivoDto[]>("/articulos/mostrarActivosFiltro", config);
};
