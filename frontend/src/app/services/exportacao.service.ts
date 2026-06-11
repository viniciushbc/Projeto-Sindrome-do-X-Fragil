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

    // Linha de título
    const linhasWs: any[][] = [
      [dados.titulo],
      dados.subtitulo ? [dados.subtitulo] : [],
      [],
    ];

    // Resumo se houver
    if (dados.resumo?.length) {
      dados.resumo.forEach(r => linhasWs.push([r.label, r.valor]));
      linhasWs.push([]);
    }

    // Cabeçalho e dados
    linhasWs.push(dados.cabecalho);
    dados.linhas.forEach(l => linhasWs.push(l));

    const ws = XLSX.utils.aoa_to_sheet(linhasWs.filter(l => l.length > 0));

    // Largura das colunas
    ws['!cols'] = dados.cabecalho.map(() => ({ wch: 22 }));

    // Mesclar título
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: dados.cabecalho.length - 1 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
  }

  // ─── PDF real (.pdf) ─────────────────────────────────────────────
  exportarPDF(dados: DadosExportacao, nomeArquivo: string): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const azul = [30, 58, 95] as [number, number, number];
    const cinzaClaro = [245, 247, 250] as [number, number, number];

    // Cabeçalho com fundo azul
    doc.setFillColor(...azul);
    doc.rect(0, 0, 297, 22, 'F');

    // Borboleta SVG simplificada como texto decorativo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGMA', 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Triagem — Síndrome do X Frágil', 40, 14);

    // Data de geração à direita
    const agora = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${agora}`, 180, 14);

    // Título do relatório
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

    // Caixas de resumo
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

    // Tabela com autoTable
    autoTable(doc, {
      startY: yResumo + 2,
      head: [dados.cabecalho],
      body: dados.linhas.map(l => l.map(String)),
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: azul,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: cinzaClaro,
      },
      columnStyles: {
        0: { cellWidth: 28 }, // Data
      },
      didDrawCell: (data: any) => {
        // Colorir coluna Resultado
        const colIdx = dados.cabecalho.indexOf('Resultado');
        if (data.section === 'body' && data.column.index === colIdx) {
          const val = data.cell.text?.[0] ?? '';
          if (val === 'Encaminhar') {
            doc.setTextColor(192, 57, 43);
          } else {
            doc.setTextColor(39, 174, 96);
          }
          doc.setFont('helvetica', 'bold');
          doc.text(val, data.cell.x + data.cell.padding('left'),
            data.cell.y + data.cell.height / 2 + 2.5);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          data.cell.text = [''];
        }
      },
    });

    // Rodapé
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
}