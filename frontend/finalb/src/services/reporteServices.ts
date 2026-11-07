import api from "../api/axios";
import type { ArticuloCategoriaDto } from "../types/articulo";
import type { ClienteFacturaDto } from "../types/reporte";

export const listarReporteArticulosCategoria = () =>
  api.get<ArticuloCategoriaDto[]>("/articulos/reporteArticulosCategoria");

export const listarReporteClienteFactura = () =>
  api.get<ClienteFacturaDto[]>("/Clientes/ReporteClienteFactura");
