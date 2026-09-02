import type { Employee, TimeEntry } from '../types'
import { formatDate, formatDuration, formatTime, formatTotalDuration } from '../utils/format'

function sanitizeFilename(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`))
    img.src = src
  })
}

export async function exportMonthlyPdf(employee: Employee, monthLabel: string, entries: TimeEntry[]) {
  const [{ jsPDF }, logo] = await Promise.all([
    import('jspdf'),
    loadImage(`${import.meta.env.BASE_URL}logos/logo_transpa.png`).catch(() => null),
  ])
  const doc = new jsPDF()
  const marginX = 20
  let y = 22

  if (logo) {
    const logoWidth = 28
    const logoHeight = (logo.height / logo.width) * logoWidth
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.addImage(logo, 'PNG', pageWidth - marginX - logoWidth, 12, logoWidth, logoHeight)
  }

  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Rooflix', marginX, y)

  y += 16
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Extracto mensual de fichajes', marginX, y)

  y += 10
  doc.setFontSize(11)
  doc.text(`Trabajador: ${employee.name}`, marginX, y)
  y += 6
  doc.text(`Periodo: ${monthLabel}`, marginX, y)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha', marginX, y)
  doc.text('Entrada', marginX + 45, y)
  doc.text('Salida', marginX + 85, y)
  doc.text('Duración', marginX + 125, y)
  y += 2
  doc.line(marginX, y, marginX + 165, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  for (const entry of entries) {
    if (y > 275) {
      doc.addPage()
      y = 22
    }
    doc.text(formatDate(entry.clockIn), marginX, y)
    doc.text(formatTime(entry.clockIn), marginX + 45, y)
    doc.text(entry.clockOut ? formatTime(entry.clockOut) : 'En curso', marginX + 85, y)
    doc.text(formatDuration(entry.clockIn, entry.clockOut), marginX + 125, y)
    y += 7
  }

  y += 3
  doc.line(marginX, y, marginX + 165, y)
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: ${formatTotalDuration(entries)}`, marginX, y)

  doc.save(`fichajes-${sanitizeFilename(employee.name)}-${sanitizeFilename(monthLabel)}.pdf`)
}
