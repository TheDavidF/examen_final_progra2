package com.examen.ferreteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.examen.ferreteria.dto.ClienteFacturaDto;
import com.examen.ferreteria.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente,Integer> {

    @Query("""
            SELECT new com.examen.ferreteria.dto.ClienteFacturaDto(
                c.idCliente, c.nombre, c.apellido, c.nit,
                f.idFactura, f.fechaFactura, f.estadoFactura, f.total
            )
            FROM Cliente c
            JOIN c.facturaList f
            """)
    java.util.List<ClienteFacturaDto> reporteClienteFactura();
}
