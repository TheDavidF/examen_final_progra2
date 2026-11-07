package com.examen.ferreteria.service;

import org.springframework.stereotype.Service;

import com.examen.ferreteria.dto.ArticuloActivoDto;
import com.examen.ferreteria.dto.ArticuloCategoriaDto;
import com.examen.ferreteria.repository.ArticulosRepository;
import java.util.List;

@Service
public class ArticuloService {

    private final ArticulosRepository articulosRepository;

    public ArticuloService(ArticulosRepository articulosRepository) {
        this.articulosRepository = articulosRepository;
    }

    public List<ArticuloActivoDto> mostrarActivosFiltro(String nombre) {
        return articulosRepository.mostrarActivosFiltro(nombre);
    }

    public List<ArticuloCategoriaDto> reporteArticulosCategoria() {
        return articulosRepository.reporteArticulosCategoria();
    }
}
