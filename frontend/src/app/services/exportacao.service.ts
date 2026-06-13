import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DadosExportacao {
  cabecalho: string[];
  linhas: (string | number)[][];
  titulo: string;
  subtitulo?: string;
  resumo?: { label: string; valor: string | number }[];
}

@Injectable({ providedIn: 'root' })
export class ExportacaoService {

  // ─── Excel real (.xlsx) ──────────────────────────────────────────
  exportarExcel(dados: DadosExportacao, nomeArquivo: string): void {
    const wb = XLSX.utils.book_new();

    const linhasWs: any[][] = [
      [dados.titulo],
      dados.subtitulo ? [dados.subtitulo] : [],
      [],
    ];

    if (dados.resumo?.length) {
      dados.resumo.forEach(r => linhasWs.push([r.label, r.valor]));
      linhasWs.push([]);
    }

    linhasWs.push(dados.cabecalho);
    dados.linhas.forEach(l => linhasWs.push(l));

    const ws = XLSX.utils.aoa_to_sheet(linhasWs.filter(l => l.length > 0));
    ws['!cols'] = dados.cabecalho.map(() => ({ wch: 22 }));
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: dados.cabecalho.length - 1 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
  }

  // ─── PDF de relatório/tabela ──────────────────────────────────────
  exportarPDF(dados: DadosExportacao, nomeArquivo: string): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const azul = [30, 58, 95] as [number, number, number];
    const cinzaClaro = [245, 247, 250] as [number, number, number];

    doc.setFillColor(...azul);
    doc.rect(0, 0, 297, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SINXF', 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Triagem — Síndrome do X Frágil', 40, 14);

    const agora = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${agora}`, 180, 14);

    doc.setTextColor(30, 58, 95);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(dados.titulo, 14, 32);

    if (dados.subtitulo) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(dados.subtitulo, 14, 38);
    }

    let yResumo = dados.subtitulo ? 44 : 38;
    if (dados.resumo?.length) {
      const boxW = 40;
      const boxH = 14;
      const boxGap = 4;
      dados.resumo.forEach((r, i) => {
        const x = 14 + i * (boxW + boxGap);
        doc.setFillColor(...cinzaClaro);
        doc.roundedRect(x, yResumo, boxW, boxH, 2, 2, 'F');
        doc.setTextColor(30, 58, 95);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(String(r.valor), x + boxW / 2, yResumo + 8, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(r.label, x + boxW / 2, yResumo + 12, { align: 'center' });
      });
      yResumo += boxH + 6;
    }

    autoTable(doc, {
      startY: yResumo + 2,
      head: [dados.cabecalho],
      body: dados.linhas.map(l => l.map(String)),
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: azul, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: cinzaClaro },
      columnStyles: { 0: { cellWidth: 28 } },
      didParseCell: (data: any) => {
        const colIdx = dados.cabecalho.indexOf('Resultado');
        if (data.section === 'body' && data.column.index === colIdx) {
          const val = data.cell.text?.[0] ?? '';
          data.cell.styles.textColor = val === 'Encaminhar'
            ? [192, 57, 43]
            : [39, 174, 96];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    const totalPaginas = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Este relatório representa uma triagem clínica. Não substitui diagnóstico médico ou laboratorial.',
        14, 200
      );
      doc.text(`Página ${i} de ${totalPaginas}`, 260, 200);
    }

    doc.save(`${nomeArquivo}.pdf`);
  }

  // ─── PDF completo de avaliação individual ────────────────────────
  exportarAvaliacaoPDF(avaliacao: any): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const azul       = [30, 58, 95]   as [number, number, number];
    const azulClaro  = [234, 242, 251] as [number, number, number];
    const cinza      = [245, 247, 250] as [number, number, number];
    const agora      = new Date().toLocaleString('pt-BR');
    const pageW      = 210;
    const marginL    = 14;
    const marginR    = 14;
    const contentW   = pageW - marginL - marginR;

    // ── Cabeçalho ──────────────────────────────────────
    doc.setFillColor(...azul);
    doc.rect(0, 0, pageW, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SINXF', marginL, 11);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Triagem — Síndrome do X Frágil', marginL, 18);

    doc.setFontSize(7.5);
    doc.text(`Avaliação #${avaliacao.id_avaliacao}   |   Gerado em: ${agora}`, pageW - marginR, 18, { align: 'right' });

    let y = 32;

    // ── Função helpers ──────────────────────────────────
    const secTitle = (title: string) => {
      doc.setFillColor(...azulClaro);
      doc.rect(marginL, y, contentW, 7, 'F');
      doc.setTextColor(...azul);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), marginL + 2, y + 5);
      y += 10;
    };

    const gridRow = (items: { label: string; valor: string }[], cols = 3) => {
      const colW = contentW / cols;
      const rowH = 12;
      items.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = marginL + col * colW;
        const yRow = y + row * rowH;

        doc.setFillColor(...cinza);
        doc.rect(x, yRow, colW - 1, rowH - 1, 'F');

        doc.setTextColor(90, 122, 153);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.text(item.label, x + 2, yRow + 4);

        doc.setTextColor(30, 58, 95);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        const texto = doc.splitTextToSize(item.valor || '—', colW - 4);
        doc.text(texto[0], x + 2, yRow + 9);
      });
      const totalRows = Math.ceil(items.length / cols);
      y += totalRows * rowH + 4;
    };

    // ── Dados do Paciente ───────────────────────────────
    secTitle('Dados do Paciente');
    gridRow([
      { label: 'Nome',               valor: avaliacao.paciente?.nome || '—' },
      { label: 'Sexo',               valor: avaliacao.paciente?.sexo === 'M' ? 'Masculino' : 'Feminino' },
      { label: 'Data de Nascimento', valor: avaliacao.paciente?.data_nascimento || '—' },
      { label: 'Responsável',        valor: avaliacao.paciente?.responsavel || '—' },
      { label: 'Telefone',           valor: avaliacao.paciente?.telefone || '—' },
    ]);

    // ── Dados da Avaliação ──────────────────────────────
    secTitle('Dados da Avaliação');
    const dataFormatada = avaliacao.data_avaliacao
      ? new Date(avaliacao.data_avaliacao).toLocaleString('pt-BR')
      : '—';
    gridRow([
      { label: 'ID da Avaliação',    valor: String(avaliacao.id_avaliacao) },
      { label: 'Data',               valor: dataFormatada },
      { label: 'Profissional',       valor: avaliacao.profissional?.nome || '—' },
      { label: 'Respondente',        valor: avaliacao.respondente?.nome || '—' },
      { label: 'Relação',            valor: avaliacao.respondente?.parentesco || '—' },
      { label: 'Observações',        valor: avaliacao.observacoes || '—' },
    ]);

    // ── Checklist de Sintomas ───────────────────────────
    if (avaliacao.respostas?.length) {
      secTitle('Checklist de Sintomas');

      const todasRespostas = avaliacao.respostas;

      autoTable(doc, {
        startY: y,
        head: [['Sintoma', 'Presente']],
        body: todasRespostas.map((r: any) => [r.nome, r.presente ? 'Sim' : 'Não']),
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: azul, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: cinza },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: (data: any) => {
          if (data.section === 'body' && data.column.index === 1) {
            const val = data.cell.text?.[0] ?? '';
            data.cell.styles.textColor = val === 'Sim'
              ? [39, 174, 96]
              : [100, 100, 100];
            data.cell.styles.fontStyle = 'bold';
          }
        },
        margin: { left: marginL, right: marginR },
      });

      y = (doc as any).lastAutoTable.finalY + 6;
    }

    // ── Resultado da Triagem ────────────────────────────
    secTitle('Resultado da Triagem');
    gridRow([
      { label: 'Score calculado',  valor: String(avaliacao.score) },
      { label: 'Limiar utilizado', valor: String(avaliacao.limiar_utilizado) },
      { label: 'Resultado',        valor: avaliacao.resultado === 'ENCAMINHAR' ? 'ENCAMINHAR' : 'NÃO ENCAMINHAR' },
    ], 3);

    // Box colorido do resultado
    const isEncaminhar = avaliacao.resultado === 'ENCAMINHAR';
    const boxColor     = isEncaminhar ? [255, 235, 235] as [number,number,number] : [235, 255, 240] as [number,number,number];
    const boxBorder    = isEncaminhar ? [220, 100, 100] as [number,number,number] : [100, 180, 120] as [number,number,number];
    const boxText      = isEncaminhar ? [150, 30, 30]   as [number,number,number] : [30, 120, 60]   as [number,number,number];

    doc.setFillColor(...boxColor);
    doc.setDrawColor(...boxBorder);
    doc.roundedRect(marginL, y, contentW, 14, 3, 3, 'FD');

    doc.setTextColor(...boxText);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const recomendacao = isEncaminhar
      ? 'Encaminhar para teste genético confirmatório.'
      : 'Triagem não indica encaminhamento prioritário no momento.';
    doc.text(recomendacao, marginL + 5, y + 9);
    y += 20;

    // ── Aviso ───────────────────────────────────────────
    doc.setFillColor(255, 251, 230);
    doc.setDrawColor(220, 180, 80);
    doc.roundedRect(marginL, y, contentW, 12, 2, 2, 'FD');
    doc.setTextColor(120, 80, 0);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Este resultado representa apenas uma triagem clínica e não substitui diagnóstico médico ou laboratorial.',
      marginL + 4, y + 8
    );
    y += 18;

    // ── Rodapé ──────────────────────────────────────────
    const totalPag = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPag; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.line(marginL, 287, pageW - marginR, 287);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `SINXF — Sistema de Triagem   |   Profissional: ${avaliacao.profissional?.nome || '—'}   |   ${agora}`,
        marginL, 292
      );
      doc.text(`Pág. ${i} / ${totalPag}`, pageW - marginR, 292, { align: 'right' });
    }

    doc.save(`avaliacao_${avaliacao.id_avaliacao}.pdf`);
  }
}