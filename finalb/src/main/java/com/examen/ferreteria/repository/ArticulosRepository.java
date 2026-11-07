package com.examen.ferreteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examen.ferreteria.entity.Articulo;
import com.examen.ferreteria.dto.ArticuloActivoDto;
import com.examen.ferreteria.dto.ArticuloCategoriaDto;

public interface ArticulosRepository extends JpaRepository<Articulo, Integer> {

    @Query("""
            SELECT new com.examen.ferreteria.dto.ArticuloActivoDto(
                a.idArticulo, a.nombre, a.marca, a.precio, a.stock, c.nombre
            )
            FROM Articulo a
            LEFT JOIN a.idCategoria c
            WHERE a.estado = true
              AND (:nombre IS NULL OR LOWER(a.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
            """)
    java.util.List<ArticuloActivoDto> mostrarActivosFiltro(@Param("nombre") String nombre);

    @Query("""
            SELECT new com.examen.ferreteria.dto.ArticuloCategoriaDto(
                a.idArticulo, a.nombre, a.marca, a.precio, a.stock, c.idCategoria, c.nombre
            )
            FROM Articulo a
            JOIN a.idCategoria c
            """)
    java.util.List<ArticuloCategoriaDto> reporteArticulosCategoria();
}
