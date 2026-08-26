/**
 * Utilidad para exportación de datos a formato CSV y descarga en el navegador.
 * Proyecto ViniGames - Módulo de Auditoría Financiera (ViniAdmin)
 */

export interface OrderExportRow {
  orderCode: string;
  createdAt: string;
  username: string;
  email: string;
  gamesCount: number;
  gamesList: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: string;
  status: string;
}

/**
 * Escapa un valor individual para cumplir con el estándar RFC 4180 de CSV.
 * Si contiene comas, comillas dobles o saltos de línea, lo encierra entre comillas.
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

/**
 * Exporta una matriz genérica de datos tabulares a un archivo CSV descargable.
 *
 * @param headers Array de encabezados de columna
 * @param rows Array de filas con los valores ordenados según los encabezados
 * @param filename Nombre del archivo a descargar (ej: reporte_ventas.csv)
 */
export function exportToCSV(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  filename: string
): void {
  if (typeof window === 'undefined') return;

  // Construir las líneas del CSV
  const headerLine = headers.map(escapeCSVValue).join(',');
  const rowLines = rows.map((row) => row.map(escapeCSVValue).join(','));
  
  // Agregar BOM UTF-8 (\uFEFF) para que Microsoft Excel abra correctamente tildes y caracteres especiales
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta una lista estructurada de órdenes de venta al formato estándar de ViniAdmin.
 *
 * @param orders Lista de órdenes con detalles de comprador y montos
 * @param customPrefix Prefijo opcional para el nombre del archivo
 */
export function exportOrdersToCSV(orders: OrderExportRow[], customPrefix = 'reporte_ventas_vinigames'): void {
  const headers = [
    'Codigo_Transaccion',
    'Fecha_Hora',
    'Usuario',
    'Email',
    'Cantidad_Juegos',
    'Titulos_Comprados',
    'Subtotal_Bs',
    'Descuento_Bs',
    'Total_Bs',
    'Metodo_Pago',
    'Estado'
  ];

  const rows = orders.map((order) => [
    order.orderCode,
    new Date(order.createdAt).toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    `@${order.username}`,
    order.email,
    order.gamesCount,
    order.gamesList,
    order.subtotal.toFixed(2),
    order.discountTotal.toFixed(2),
    order.total.toFixed(2),
    order.paymentMethod,
    order.status
  ]);

  const now = new Date();
  const dateStamp = now.toISOString().split('T')[0];
  const timeStamp = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `${customPrefix}_${dateStamp}_${timeStamp}.csv`;

  exportToCSV(headers, rows, filename);
}
