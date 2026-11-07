export interface ClienteFacturaDto {
  idCliente: number;
  nombre: string | null;
  apellido: string | null;
  nit: string | null;
  idFactura: number;
  fechaFactura: string | null;
  estadoFactura: boolean | null;
  total: number | null;
}
