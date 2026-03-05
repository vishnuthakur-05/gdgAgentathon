import { AnalysisReport, BusinessInfo } from './types';
import jsPDF from 'jspdf';

// --- CONFIGURATION & STYLING ---

const PDF_COLORS = {
  PRIMARY: [22, 38, 76] as [number, number, number], // Deep Navy
  SECONDARY: [79, 70, 229] as [number, number, number], // Indigo
  TEXT_DARK: [15, 23, 42] as [number, number, number], // Slate 900
  TEXT_MUTED: [71, 85, 105] as [number, number, number], // Slate 600
  ACCENT_BG: [248, 250, 252] as [number, number, number], // Slate 50
  BORDER: [226, 232, 240] as [number, number, number], // Slate 200
  ALERT: [185, 28, 28] as [number, number, number], // Red
};

// --- MAIN GENERATOR FUNCTION ---

export const downloadReportPDF = async (report: AnalysisReport, info: BusinessInfo) => {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  // Layout Constants
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeightFactor = 0.5; // Fine-tune line spacing

  let yPos = 30; // Current cursor position

  // --- HELPER FUNCTIONS ---

  // Check if a block of height 'h' fits; if not, add page
  const checkFit = (h: number) => {
    if (yPos + h > pageHeight - margin) {
      doc.addPage();
      yPos = 25; // Reset to top margin
      return true;
    }
    return false;
  };

  // Add wrapped text with dynamic height calculation
  const addText = (
    text: string,
    size: number,
    font: 'normal' | 'bold' | 'italic',
    color: [number, number, number],
    indent: number = 0,
    maxWidth?: number
  ) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', font);
    doc.setTextColor(color[0], color[1], color[2]);

    const effectiveWidth = maxWidth || (contentWidth - indent);
    // Split text into lines that fit the width
    const lines = doc.splitTextToSize(text, effectiveWidth);
    // Calculate exact height of this text block
    const blockHeight = lines.length * size * lineHeightFactor;

    checkFit(blockHeight);

    doc.text(lines, margin + indent, yPos);
    yPos += blockHeight + 3; // Add small buffer after paragraph
  };

  // Draw a horizontal divider line
  const addDivider = () => {
    yPos += 4;
    doc.setDrawColor(PDF_COLORS.BORDER[0], PDF_COLORS.BORDER[1], PDF_COLORS.BORDER[2]);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  };

  // Create a styled box for strategic insights
  const addInsightBox = (insight: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');

    // Calculate text dimensions
    const padding = 6;
    const boxWidth = contentWidth;
    const textWidth = boxWidth - (padding * 2);
    const lines = doc.splitTextToSize(insight, textWidth);
    const textHeight = lines.length * 10 * lineHeightFactor;
    const boxHeight = textHeight + (padding * 2);

    // Ensure the whole box fits on the page
    checkFit(boxHeight + 5);

    // Draw Background Box
    doc.setFillColor(PDF_COLORS.ACCENT_BG[0], PDF_COLORS.ACCENT_BG[1], PDF_COLORS.ACCENT_BG[2]);
    doc.setDrawColor(PDF_COLORS.SECONDARY[0], PDF_COLORS.SECONDARY[1], PDF_COLORS.SECONDARY[2]);
    doc.rect(margin, yPos, boxWidth, boxHeight, 'F');

    // Draw Left Accent Line (Visual flair)
    doc.setLineWidth(1);
    doc.line(margin, yPos, margin, yPos + boxHeight);
    doc.setLineWidth(0.2); // Reset line width

    // Draw Text inside the box
    doc.setTextColor(PDF_COLORS.SECONDARY[0], PDF_COLORS.SECONDARY[1], PDF_COLORS.SECONDARY[2]);
    doc.text(lines, margin + padding, yPos + padding + 3);

    yPos += boxHeight + 6;
  };

  // --- DOCUMENT GENERATION FLOW ---

  try {
    // 1. Branding Header (Fixed top bar)
    doc.setFillColor(PDF_COLORS.PRIMARY[0], PDF_COLORS.PRIMARY[1], PDF_COLORS.PRIMARY[2]);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text("COMPETITOR AI | STRATEGIC BRIEF", margin, 10);

    // 2. Info Block
    addText(info.name, 24, 'bold', PDF_COLORS.TEXT_DARK);
    addText(`${info.niche} • ${info.region}`, 10, 'normal', PDF_COLORS.TEXT_MUTED);
    addText(`Generated: ${report.generatedAt}`, 10, 'normal', PDF_COLORS.TEXT_MUTED);
    addDivider();

    // 3. Executive Summary
    addText("01. EXECUTIVE SUMMARY", 12, 'bold', PDF_COLORS.PRIMARY);
    yPos += 2;
    addText(report.executiveSummary, 11, 'normal', PDF_COLORS.TEXT_DARK);
    yPos += 6;

    // 4. Strategic Signals
    addDivider();
    addText("02. MARKET SIGNALS", 12, 'bold', PDF_COLORS.PRIMARY);
    yPos += 4;

    report.marketSignals.forEach(signal => {
      checkFit(40); // Check if there's enough room for at least a header + one line

      // Signal Header (Custom layout for Label + Value)
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(PDF_COLORS.TEXT_DARK[0], PDF_COLORS.TEXT_DARK[1], PDF_COLORS.TEXT_DARK[2]);
      doc.text(signal.label, margin, yPos);

      // Value (Right Aligned)
      const valueWidth = doc.getStringUnitWidth(signal.value) * 11 / doc.internal.scaleFactor;
      doc.text(signal.value, pageWidth - margin - valueWidth, yPos);
      yPos += 6;

      // Description
      addText(signal.description, 10, 'normal', PDF_COLORS.TEXT_MUTED);

      // Insight Box
      addInsightBox(`STRATEGIC IMPLICATION: ${signal.insight}`);
    });

    // 5. Competitors
    addDivider();
    addText("03. COMPETITIVE PRESSURE", 12, 'bold', PDF_COLORS.PRIMARY);
    yPos += 4;

    report.competitors.forEach(comp => {
      checkFit(45);
      addText(comp.name, 12, 'bold', PDF_COLORS.TEXT_DARK);
      addText(`Positioning: ${comp.positioning}`, 10, 'italic', PDF_COLORS.TEXT_MUTED);
      addText(`Details: Share: ${comp.marketShare || 'N/A'} | Growth: ${comp.growthRate || 'N/A'} | Maturity: ${comp.productMaturity || 'N/A'}`, 9, 'normal', PDF_COLORS.TEXT_MUTED);
      addText(`Pressure: ${comp.competitivePressure}`, 10, 'normal', PDF_COLORS.ALERT);
      yPos += 4;
    });

    // 6. Recommended Actions
    addDivider();
    addText("04. RECOMMENDED ACTIONS", 12, 'bold', PDF_COLORS.PRIMARY);
    yPos += 4;

    report.strategicMoves.forEach((move, i) => {
      checkFit(40);
      addText(`${i + 1}. ${move.move}`, 11, 'bold', PDF_COLORS.TEXT_DARK);
      addText(move.reasoning, 10, 'normal', PDF_COLORS.TEXT_MUTED, 5);
      addText(`Impact: ${move.impact}`, 10, 'bold', PDF_COLORS.SECONDARY, 5);
      yPos += 4;
    });

    // 7. Momentum & Synthesis
    addDivider();
    addText("05. MOMENTUM & SYNTHESIS", 12, 'bold', PDF_COLORS.PRIMARY);
    yPos += 4;
    addInsightBox(report.momentumSynthesis);

    // 7. Footer (Page Numbers)
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `CONFIDENTIAL | ${info.name.toUpperCase()} | PAGE ${i}/${pageCount}`,
        margin,
        pageHeight - 10
      );
    }

    // Save File
    const safeName = info.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeName}_strategy_brief.pdf`);
    return true;
  } catch (error) {
    console.error("PDF Gen Error:", error);
    throw error;
  }
};

export const sendReportEmail = async (email: string, report: AnalysisReport, info: BusinessInfo) => {
  // Mock email service (placeholder)
  return new Promise(resolve => setTimeout(resolve, 1000));
};