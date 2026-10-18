/**
 * Livrete da ANE - Reports & Export Service
 * Geração de Relatórios Oficiais (Folha Semanal do Condutor e Relatório de Frota)
 * Em conformidade com os requisitos da Portaria n.º 7/2022
 */

import { jsPDF } from 'jspdf';
import { Journey, User, Company, Vehicle, ActivityEvent } from '../types';

export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDatePT(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-PT');
  } catch {
    return dateStr;
  }
}

/**
 * Exporta jornadas para ficheiro CSV em formato português (delimitador ponto e vírgula)
 */
export function exportJourneysToCSV(
  journeys: Journey[],
  driverName?: string,
  companyName?: string
): void {
  const headers = [
    'ID Jornada',
    'Data (DD/MM/AAAA)',
    'Condutor',
    'Matrícula',
    'Viatura Modelo',
    'Hora Início',
    'Local Início',
    'Km Inicial',
    'Hora Fim',
    'Local Fim',
    'Km Final',
    'Km Percorridos',
    'Condução (a) (HH:MM)',
    'Outro Trabalho Mesmo Empregador (b) (HH:MM)',
    'Outro Emprego (c) (HH:MM)',
    'Total Trabalho (a+b+c) (HH:MM)',
    'Disponibilidade (HH:MM)',
    'Repouso (HH:MM)',
    'Estado',
    'Observações',
  ];

  const rows = journeys.map((j) => [
    j.id,
    formatDatePT(j.date),
    `"${j.driverName.replace(/"/g, '""')}"`,
    `"${j.vehiclePlate}"`,
    `"${(j.vehicleModel || '').replace(/"/g, '""')}"`,
    j.start.time,
    `"${j.start.locationName.replace(/"/g, '""')}"`,
    j.start.km,
    j.end?.time || '--:--',
    `"${(j.end?.locationName || '--').replace(/"/g, '""')}"`,
    j.end?.km || '--',
    j.totalKm || (j.end ? j.end.km - j.start.km : 0),
    formatMinutesToHours(j.breakdown.drivingMinutes),
    formatMinutesToHours(j.breakdown.otherWorkSameMinutes),
    formatMinutesToHours(j.breakdown.otherWorkOtherMinutes),
    formatMinutesToHours(j.breakdown.totalWorkMinutes),
    formatMinutesToHours(j.breakdown.availabilityMinutes),
    formatMinutesToHours(j.breakdown.restingMinutes),
    j.isClosed ? 'Fechado' : 'Em Curso',
    `"${(j.reviewNotes || '').replace(/"/g, '""')}"`,
  ]);

  // UTF-8 BOM para abrir perfeitamente no Excel português
  const csvContent =
    '\uFEFF' +
    [
      `"Livrete da ANE - Registo de Jornadas de Trabalho (Portaria n.º 7/2022)"`,
      `"Emissão: ${new Date().toLocaleString('pt-PT')}"`,
      companyName ? `"Empresa: ${companyName}"` : `"Tipo: Condutor Independente"`,
      driverName ? `"Condutor: ${driverName}"` : `""`,
      '',
      headers.join(';'),
      ...rows.map((r) => r.join(';')),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `livrete_ane_relatorio_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Gera documento PDF oficial da Folha de Registo Semanal do Condutor / Empresa
 */
export function generateWeeklyReportPDF(params: {
  driver: User;
  company?: Company | null;
  vehicle?: Vehicle | null;
  journeys: Journey[];
  startDateStr: string;
  endDateStr: string;
}): void {
  const { driver, company, vehicle, journeys, startDateStr, endDateStr } = params;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Cabeçalho Principal
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 297, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Livrete da ANE · Registo de Trabalho de Condução', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Portaria n.º 7/2022 · Relatório Oficial para Efeitos de Fiscalização', 200, 12);

  // Informações do Empregador / Condutor / Viatura
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DADOS DE IDENTIFICAÇÃO', 14, 28);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 31, 269, 24, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Empregador / Entidade:', 18, 38);
  doc.text('Condutor:', 18, 45);
  doc.text('Período de Referência:', 18, 51);

  doc.setFont('helvetica', 'normal');
  const compInfo = company
    ? `${company.name} (NIF: ${company.nif})`
    : 'Condutor Independente / Recibo Verde';
  doc.text(compInfo, 58, 38);

  const driverInfo = `${driver.name} | NIF: ${driver.nif || 'Não indicado'} | Carta: ${
    driver.driverLicenseNumber || 'L-Registo'
  }`;
  doc.text(driverInfo, 58, 45);

  const periodText = `${formatDatePT(startDateStr)} até ${formatDatePT(endDateStr)}`;
  doc.text(periodText, 58, 51);

  doc.setFont('helvetica', 'bold');
  doc.text('Viatura Habitual:', 180, 38);
  doc.text('Data de Emissão:', 180, 45);
  doc.text('Sistema Certificado:', 180, 51);

  doc.setFont('helvetica', 'normal');
  const vehInfo = vehicle
    ? `${vehicle.plate} (${vehicle.brand} ${vehicle.model})`
    : journeys[0]
    ? `${journeys[0].vehiclePlate}`
    : 'Diversas';
  doc.text(vehInfo, 215, 38);
  doc.text(`${new Date().toLocaleString('pt-PT')}`, 215, 45);
  doc.text('Livrete da ANE v1.4 (Portaria 7/2022)', 215, 51);

  // Tabela de Jornadas
  let y = 62;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 269, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('Data', 16, y + 5.5);
  doc.text('Matrícula', 36, y + 5.5);
  doc.text('Início (Hora / Local / Km)', 60, y + 5.5);
  doc.text('Fim (Hora / Local / Km)', 115, y + 5.5);
  doc.text('Km Tot.', 170, y + 5.5);
  doc.text('Condução (a)', 185, y + 5.5);
  doc.text('Outro (b)', 205, y + 5.5);
  doc.text('Outro (c)', 220, y + 5.5);
  doc.text('Total Trab.', 235, y + 5.5);
  doc.text('Disponív.', 253, y + 5.5);
  doc.text('Repouso', 268, y + 5.5);

  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  let totalKmAll = 0;
  let totalDrivingMins = 0;
  let totalWorkMins = 0;
  let totalRestMins = 0;

  if (journeys.length === 0) {
    doc.text('Nenhum período de trabalho registado no intervalo selecionado.', 16, y + 6);
    y += 12;
  } else {
    journeys.forEach((j) => {
      const startInfo = `${j.start.time} | ${j.start.locationName.slice(0, 18)} | ${j.start.km} km`;
      const endInfo = j.end
        ? `${j.end.time} | ${j.end.locationName.slice(0, 18)} | ${j.end.km} km`
        : 'Em curso / pendente km final';
      const kmTot = j.totalKm || (j.end ? j.end.km - j.start.km : 0);

      totalKmAll += kmTot;
      totalDrivingMins += j.breakdown.drivingMinutes;
      totalWorkMins += j.breakdown.totalWorkMinutes;
      totalRestMins += j.breakdown.restingMinutes;

      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 5, 283, y + 5);

      doc.text(formatDatePT(j.date), 16, y + 4);
      doc.text(j.vehiclePlate, 36, y + 4);
      doc.text(startInfo, 60, y + 4);
      doc.text(endInfo, 115, y + 4);
      doc.text(`${kmTot}`, 170, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.drivingMinutes), 185, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.otherWorkSameMinutes), 205, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.otherWorkOtherMinutes), 220, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.totalWorkMinutes), 235, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.availabilityMinutes), 253, y + 4);
      doc.text(formatMinutesToHours(j.breakdown.restingMinutes), 268, y + 4);

      y += 6.5;
    });
  }

  // Linha de Totais
  y += 2;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 269, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL DO PERÍODO:', 60, y + 4.5);
  doc.text(`${totalKmAll} km`, 170, y + 4.5);
  doc.text(formatMinutesToHours(totalDrivingMins), 185, y + 4.5);
  doc.text(formatMinutesToHours(totalWorkMins), 235, y + 4.5);
  doc.text(formatMinutesToHours(totalRestMins), 268, y + 4.5);

  // Área de Validação e Assinaturas
  const sigY = 168;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, sigY + 12, 110, sigY + 12);
  doc.line(180, sigY + 12, 270, sigY + 12);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura / Validação Digital do Condutor', 35, sigY + 16);
  doc.text('Assinatura / Validação da Entidade Empregadora', 190, sigY + 16);

  // Rodapé legal
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Aviso Legal: Documento emitido nos termos da Portaria n.º 7/2022 de 4 de janeiro. O registo digital deve ser conservado durante 5 anos à disposição das entidades fiscalizadoras.',
    14,
    195
  );

  doc.save(`jornadapro_folha_semanal_${driver.name.replace(/\s+/g, '_')}_${startDateStr}.pdf`);
}
