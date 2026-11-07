package com.examen.ferreteria.controller;

import com.examen.ferreteria.dto.ArticuloActivoDto;
import com.examen.ferreteria.dto.ArticuloCategoriaDto;
import com.examen.ferreteria.service.ArticuloService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/articulos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ArticuloController {

    private final ArticuloService articuloService;

    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    @GetMapping("/mostrarActivosFiltro")
    public List<ArticuloActivoDto> mostrarActivosFiltro(
            @RequestParam(required = false) String nombre) {
        return articuloService.mostrarActivosFiltro(nombre);
    }

    @GetMapping("/reporteArticulosCategoria")
    public List<ArticuloCategoriaDto> reporteArticulosCategoria() {
        return articuloService.reporteArticulosCategoria();
    }
}

