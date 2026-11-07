package com.examen.ferreteria.dto;

import java.math.BigDecimal;
import java.util.Date;

public record ClienteFacturaDto(
        Integer idCliente,
        String nombre,
        String apellido,
        String nit,
        Integer idFactura,
        Date fechaFactura,
        Boolean estadoFactura,
        BigDecimal total) {
}
