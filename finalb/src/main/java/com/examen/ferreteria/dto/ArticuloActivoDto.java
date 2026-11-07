package com.examen.ferreteria.dto;

import java.math.BigDecimal;

public record ArticuloActivoDto(
        Integer idArticulo,
        String nombre,
        String marca,
        BigDecimal precio,
        Integer stock,
        String nombreCategoria) {
}
