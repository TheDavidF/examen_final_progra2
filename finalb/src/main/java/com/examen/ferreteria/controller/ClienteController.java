package com.examen.ferreteria.controller;

import com.examen.ferreteria.dto.ClienteFacturaDto;
import com.examen.ferreteria.service.ClienteService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Clientes")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/ReporteClienteFactura")
    public List<ClienteFacturaDto> reporteClienteFactura() {
        return clienteService.reporteClienteFactura();
    }
}
