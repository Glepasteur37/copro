import jsPDF from 'jspdf';

export type PdfSection = { heading: string; lines: string[] };

export function generateSimplePdf(title: string, sections: PdfSection[], fileName: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 10, 15);
  let y = 25;
  sections.forEach((section) => {
    doc.setFontSize(12);
    doc.text(section.heading, 10, y);
    y += 6;
    section.lines.forEach((line) => {
      doc.text(`- ${line}`, 12, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 15;
      }
    });
    y += 4;
  });
  doc.save(fileName);
}

export function downloadCsv(fileName: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
