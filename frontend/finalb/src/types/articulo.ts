export interface ArticuloActivoDto {
  idArticulo: number;
  nombre: string | null;
  marca: string | null;
  precio: number | null;
  stock: number | null;
  nombreCategoria: string | null;
}

export interface ArticuloCategoriaDto {
  idArticulo: number;
  nombreArticulo: string | null;
  marca: string | null;
  precio: number | null;
  stock: number | null;
  idCategoria: number | null;
  nombreCategoria: string | null;
}
