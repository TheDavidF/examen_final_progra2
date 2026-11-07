package com.examen.ferreteria.dto;

import java.math.BigDecimal;

public record ArticuloCategoriaDto(
        Integer idArticulo,
        String nombreArticulo,
        String marca,
        BigDecimal precio,
        Integer stock,
        Integer idCategoria,
        String nombreCategoria) {
}
