import { useRef, useState, type FormEvent } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { listarArticulosActivos } from "../services/articuloServices";
import {
  listarReporteArticulosCategoria,
  listarReporteClienteFactura,
} from "../services/reporteServices";
import type {
  ArticuloActivoDto,
  ArticuloCategoriaDto,
} from "../types/articulo";
import type { ClienteFacturaDto } from "../types/reporte";

type ReportType = "articulos-activos" | "articulos-categoria" | "cliente-factura";
type ReportRow = string | number | boolean | null;

type ReportData =
  | {
      type: "articulos-activos";
      filter: string;
      rows: ArticuloActivoDto[];
    }
  | {
      type: "articulos-categoria";
      filter: string;
      rows: ArticuloCategoriaDto[];
    }
  | {
      type: "cliente-factura";
      filter: string;
      rows: ClienteFacturaDto[];
    };

type ReportTable = {
  headers: string[];
  rows: ReportRow[][];
};

const reportOptions: {
  type: ReportType;
  title: string;
  description: string;
  filterLabel: string;
}[] = [
  {
    type: "articulos-activos",
    title: "Artículos activos",
    description: "Consulta los artículos activos y filtra por nombre.",
    filterLabel: "Nombre del artículo",
  },
  {
    type: "articulos-categoria",
    title: "Artículos por categoría",
    description: "Consulta cada artículo junto con su categoría.",
    filterLabel: "Nombre del artículo",
  },
  {
    type: "cliente-factura",
    title: "Facturas por cliente",
    description: "Consulta las facturas asociadas a cada cliente.",
    filterLabel: "Nombre del cliente",
  },
];

const reportTitle = (type: ReportType) =>
  reportOptions.find((option) => option.type === type)?.title ?? "Reporte";

async function consultarReporte(
  type: ReportType,
  filter: string,
): Promise<ReportData> {
  if (type === "articulos-activos") {
    const response = await listarArticulosActivos(filter);
    return { type, filter, rows: response.data };
  }

  if (type === "articulos-categoria") {
    const response = await listarReporteArticulosCategoria();
    const normalizedFilter = filter.toLocaleLowerCase();
    const rows = response.data.filter((articulo) =>
      (articulo.nombreArticulo ?? "")
        .toLocaleLowerCase()
        .includes(normalizedFilter),
    );
    return { type, filter, rows };
  }

  const response = await listarReporteClienteFactura();
  const normalizedFilter = filter.toLocaleLowerCase();
  const rows = response.data.filter((factura) =>
    `${factura.nombre ?? ""} ${factura.apellido ?? ""}`
      .toLocaleLowerCase()
      .includes(normalizedFilter),
  );
  return { type, filter, rows };
}

function crearTabla(data: ReportData): ReportTable {
  if (data.type === "articulos-activos") {
    return {
      headers: ["ID", "Nombre", "Marca", "Precio", "Stock", "Categoría"],
      rows: data.rows.map((articulo) => [
        articulo.idArticulo,
        articulo.nombre,
        articulo.marca,
        articulo.precio,
        articulo.stock,
        articulo.nombreCategoria,
      ]),
    };
  }

  if (data.type === "articulos-categoria") {
    return {
      headers: [
        "ID artículo",
        "Artículo",
        "Marca",
        "Precio",
        "Stock",
        "ID categoría",
        "Categoría",
      ],
      rows: data.rows.map((articulo) => [
        articulo.idArticulo,
        articulo.nombreArticulo,
        articulo.marca,
        articulo.precio,
        articulo.stock,
        articulo.idCategoria,
        articulo.nombreCategoria,
      ]),
    };
  }

  return {
    headers: [
      "ID cliente",
      "Nombre",
      "Apellido",
      "NIT",
      "ID factura",
      "Fecha",
      "Estado factura",
      "Total",
    ],
    rows: data.rows.map((factura) => [
      factura.idCliente,
      factura.nombre,
      factura.apellido,
      factura.nit,
      factura.idFactura,
      factura.fechaFactura,
      factura.estadoFactura,
      factura.total,
    ]),
  };
}

async function cargarLogo(): Promise<string | null> {
  const response = await fetch(`${import.meta.env.BASE_URL}logo.png`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`No se pudo cargar el logo (${response.status}).`);
  }

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("No se pudo leer el archivo del logo."));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("No se pudo leer el archivo del logo."));
    reader.readAsDataURL(blob);
  });
}

async function crearPdf(data: ReportData) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });
  const table = crearTabla(data);
  const logo = await cargarLogo();

  doc.setFontSize(18);
  doc.text(reportTitle(data.type), 14, 16);
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 24);
  if (logo) {
    doc.addImage(logo, "PNG", 255, 7, 28, 22);
  }

  autoTable(doc, {
    head: [table.headers],
    body: table.rows.map((row) =>
      row.map((cell) =>
        cell === null ? "" : typeof cell === "boolean" ? (cell ? "Sí" : "No") : cell,
      ),
    ),
    startY: 34,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 101, 52] },
  });
  return doc;
}

function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      return "No se pudo conectar con el backend. Reinicia Spring Boot para aplicar la configuración CORS.";
    }
    const responseMessage =
      error.response?.data?.mensaje ?? error.response?.data?.message;
    return typeof responseMessage === "string"
      ? responseMessage
      : `No se pudo consultar el reporte: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado al consultar el reporte.";
}

function descargarArchivo(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = fileName;
  enlace.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Reportes() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [filterText, setFilterText] = useState("");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const requestSequence = useRef(0);

  const loadReport = async (type: ReportType, filter: string) => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setReportData(null);
    setMessage("");
    try {
      const data = await consultarReporte(type, filter);
      if (requestId === requestSequence.current) {
        setReportData(data);
      }
    } catch (error) {
      if (requestId === requestSequence.current) {
        setMessage(obtenerMensajeError(error));
      }
    } finally {
      if (requestId === requestSequence.current) {
        setLoading(false);
      }
    }
  };

  const openReport = (type: ReportType) => {
    setFilterText("");
    setReportData(null);
    setMessage("");
    setSelectedReport(type);
    void loadReport(type, "");
  };

  const closeReport = () => {
    requestSequence.current += 1;
    setSelectedReport(null);
    setReportData(null);
    setLoading(false);
  };

  const applyFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedReport) {
      return;
    }

    const filter = filterText.trim();
    void loadReport(selectedReport, filter);
  };

  const currentData =
    reportData?.type === selectedReport &&
    reportData.filter === filterText.trim()
      ? reportData
      : null;
  const currentTable = currentData ? crearTabla(currentData) : null;
  const hasResults = Boolean(currentData && currentData.rows.length > 0);
  const selectedOption = reportOptions.find(
    (option) => option.type === selectedReport,
  );

  const exportPdf = async () => {
    if (!currentData) {
      return;
    }
    try {
      const doc = await crearPdf(currentData);
      doc.save(`${currentData.type}.pdf`);
    } catch (error) {
      setMessage(obtenerMensajeError(error));
    }
  };

  const previewPdf = async () => {
    if (!currentData) {
      return;
    }
    const previewWindow = window.open("about:blank", "_blank");
    if (!previewWindow) {
      setMessage("Permite las ventanas emergentes para ver el PDF.");
      return;
    }

    try {
      const doc = await crearPdf(currentData);
      previewWindow.location.href = doc.output("bloburl").toString();
    } catch (error) {
      previewWindow.close();
      setMessage(obtenerMensajeError(error));
    }
  };

  const exportExcel = async () => {
    if (!currentData || !currentTable) {
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reporte");
      sheet.addRow([reportTitle(currentData.type)]).font = {
        size: 16,
        bold: true,
      };
      sheet.addRow([`Fecha de generación: ${new Date().toLocaleString()}`]);
      sheet.addRow([]);

      const header = sheet.addRow(currentTable.headers);
      header.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF166534" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      currentTable.rows.forEach((row, index) => {
        const excelRow = sheet.addRow(row);
        excelRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (index % 2 === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0FDF4" },
            };
          }
        });
      });
      sheet.columns.forEach((column) => {
        column.width = Math.min(
          Math.max(
            14,
            ...(column.values ?? [])
              .slice(1)
              .map((value) => String(value ?? "").length + 2),
          ),
          36,
        );
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      descargarArchivo(blob, `${currentData.type}.xlsx`);
    } catch (error) {
      setMessage(obtenerMensajeError(error));
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Ferretería · Centro de reportes
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reportes
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Consulta los artículos activos o revisa su distribución por
          categoría. Descarga los datos filtrados en PDF o Excel.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportOptions.map((option) => (
          <article
            key={option.type}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              {option.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              {option.description}
            </p>
            <button
              type="button"
              onClick={() => openReport(option.type)}
              className="mt-5 w-fit rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              Abrir reporte
            </button>
          </article>
        ))}
      </section>

      {selectedReport && selectedOption && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReport();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="report-title"
                  className="text-xl font-semibold text-slate-900"
                >
                  {selectedOption.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Filtra los datos y elige una opción de exportación.
                </p>
              </div>
              <button
                type="button"
                onClick={closeReport}
                aria-label="Cerrar reporte"
                className="rounded-md px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={applyFilter}
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="report-filter"
                  className="block text-sm font-medium text-slate-700"
                >
                  {selectedOption.filterLabel}
                </label>
                <input
                  id="report-filter"
                  type="search"
                  value={filterText}
                  onChange={(event) => setFilterText(event.target.value)}
                  placeholder={`Escribe ${selectedOption.filterLabel.toLocaleLowerCase()}`}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Consultando..." : "Aplicar filtro"}
              </button>
            </form>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void exportPdf()}
                disabled={!hasResults || loading}
                className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Exportar a PDF
              </button>
              <button
                type="button"
                onClick={() => void exportExcel()}
                disabled={!hasResults || loading}
                className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Exportar a Excel
              </button>
              <button
                type="button"
                onClick={() => void previewPdf()}
                disabled={!hasResults || loading}
                className="rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ver PDF
              </button>
            </div>

            {message && (
              <p
                role="alert"
                className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
              >
                {message}
              </p>
            )}
            {loading && (
              <p role="status" className="mb-4 text-sm text-slate-600">
                Consultando datos del reporte...
              </p>
            )}
            {!loading && currentData?.rows.length === 0 && (
              <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                No se encontraron resultados para el filtro actual.
              </p>
            )}
            {currentTable && currentData && currentData.rows.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      {currentTable.headers.map((header) => (
                        <th
                          key={header}
                          className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.rows.map((row, rowIndex) => (
                      <tr
                        key={`${currentData.type}-${rowIndex}`}
                        className="odd:bg-white even:bg-slate-50"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${currentData.type}-${rowIndex}-${cellIndex}`}
                            className="whitespace-nowrap border-b border-slate-200 px-3 py-3"
                          >
                            {cell === null ? "—" : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Reportes;
