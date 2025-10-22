/**
 * PDF Generation Service for Comprehensive Business Intelligence Reports
 * Uses jsPDF and html2canvas to generate professional PDF reports
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from the comprehensive report
 * @param {Object} reportData - Complete report data including assessment, business context, and AI insights
 * @param {string} companyName - Company name for the report
 * @returns {Promise<void>}
 */
export async function generateComprehensivePDF(reportData, companyName = 'Your Company') {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add cover page
    addCoverPage(pdf, reportData, companyName, pageWidth, pageHeight);

    // Add new page for executive summary
    pdf.addPage();
    yPosition = 20;
    
    // Add executive summary
    yPosition = addExecutiveSummary(pdf, reportData, yPosition, pageWidth);

    // Add performance overview
    pdf.addPage();
    yPosition = 20;
    yPosition = addPerformanceOverview(pdf, reportData, yPosition, pageWidth);

    // Add category breakdown
    if (reportData.category_deep_dives && reportData.category_deep_dives.length > 0) {
      pdf.addPage();
      yPosition = 20;
      yPosition = addCategoryBreakdown(pdf, reportData, yPosition, pageWidth, pageHeight);
    }

    // Add recommendations
    pdf.addPage();
    yPosition = 20;
    addRecommendations(pdf, reportData, yPosition, pageWidth);

    // Add consultation CTA
    pdf.addPage();
    addConsultationCTA(pdf, pageWidth, pageHeight);

    // Save the PDF
    const fileName = `${companyName.replace(/[^a-z0-9]/gi, '_')}_Business_Intelligence_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add cover page to PDF
 */
function addCoverPage(pdf, reportData, companyName, pageWidth, pageHeight) {
  // Background gradient effect (simulated with rectangles)
  pdf.setFillColor(37, 99, 235); // Blue
  pdf.rect(0, 0, pageWidth, pageHeight / 2, 'F');
  pdf.setFillColor(79, 70, 229); // Indigo
  pdf.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Business Intelligence Report', pageWidth / 2, 60, { align: 'center' });

  // Subtitle
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Comprehensive 360° Assessment', pageWidth / 2, 75, { align: 'center' });

  // Company name
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(companyName, pageWidth / 2, 100, { align: 'center' });

  // Score box
  const boxWidth = 80;
  const boxHeight = 40;
  const boxX = (pageWidth - boxWidth) / 2;
  const boxY = 120;

  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 5, 5, 'F');

  pdf.setTextColor(37, 99, 235);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  const percentage = reportData.assessment_summary?.percentage || 0;
  pdf.text(`${percentage.toFixed(1)}%`, pageWidth / 2, boxY + 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Overall Score', pageWidth / 2, boxY + 32, { align: 'center' });

  // Grade
  const grade = reportData.assessment_summary?.grade || 'N/A';
  pdf.setFontSize(48);
  pdf.setFont('helvetica', 'bold');
  pdf.text(grade, pageWidth / 2, boxY + 65, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Performance Grade', pageWidth / 2, boxY + 75, { align: 'center' });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 255);
  pdf.text('Powered by Datrix™ Business Intelligence Scanner', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text('Navvi Corporation | consulting.navvicorp.com', pageWidth / 2, pageHeight - 12, { align: 'center' });

  // Date
  const reportDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(`Generated on: ${reportDate}`, pageWidth / 2, pageHeight - 4, { align: 'center' });
}

/**
 * Add executive summary section
 */
function addExecutiveSummary(pdf, reportData, yPosition, pageWidth) {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, yPosition);
  yPosition += 12;

  // Summary text
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const summaryText = reportData.ai_insights?.executive_summary || 
    `Your business scored ${reportData.assessment_summary?.percentage?.toFixed(1)}% overall in this comprehensive assessment.`;
  
  const splitSummary = pdf.splitTextToSize(summaryText, pageWidth - 40);
  pdf.text(splitSummary, 20, yPosition);
  yPosition += splitSummary.length * 6 + 10;

  // Critical insight box
  if (reportData.ai_insights?.critical_insight) {
    pdf.setFillColor(139, 92, 246); // Purple
    pdf.roundedRect(20, yPosition, pageWidth - 40, 25, 3, 3, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Critical Insight:', 25, yPosition + 8);

    pdf.setFont('helvetica', 'normal');
    const insightText = pdf.splitTextToSize(reportData.ai_insights.critical_insight, pageWidth - 50);
    pdf.text(insightText, 25, yPosition + 15);
    yPosition += 30;
  }

  // Key findings
  if (reportData.ai_insights?.key_findings && reportData.ai_insights.key_findings.length > 0) {
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Findings:', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    reportData.ai_insights.key_findings.forEach((finding, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`• ${finding}`, 25, yPosition);
      yPosition += 6;
    });
  }

  return yPosition;
}

/**
 * Add performance overview section
 */
function addPerformanceOverview(pdf, reportData, yPosition, pageWidth) {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Overview', 20, yPosition);
  yPosition += 12;

  // Category scores table
  if (reportData.assessment_summary?.category_scores) {
    const categories = Object.entries(reportData.assessment_summary.category_scores);
    
    // Table headers
    pdf.setFillColor(37, 99, 235);
    pdf.rect(20, yPosition, pageWidth - 40, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category', 25, yPosition + 7);
    pdf.text('Score', pageWidth - 60, yPosition + 7);
    pdf.text('Performance', pageWidth - 35, yPosition + 7);
    yPosition += 10;

    // Table rows
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    categories.forEach(([categoryName, data], index) => {
      const bgColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
      pdf.setFillColor(...bgColor);
      pdf.rect(20, yPosition, pageWidth - 40, 10, 'F');

      pdf.text(categoryName, 25, yPosition + 7);
      pdf.text(`${data.percentage?.toFixed(1)}%`, pageWidth - 60, yPosition + 7);
      
      // Performance indicator
      const perfColor = data.percentage >= 70 ? [34, 197, 94] : 
                       data.percentage >= 40 ? [251, 191, 36] : [239, 68, 68];
      pdf.setFillColor(...perfColor);
      pdf.circle(pageWidth - 30, yPosition + 5, 2, 'F');

      yPosition += 10;
    });
  }

  return yPosition;
}

/**
 * Add category breakdown section
 */
function addCategoryBreakdown(pdf, reportData, yPosition, pageWidth, pageHeight) {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Category Analysis', 20, yPosition);
  yPosition += 12;

  reportData.category_deep_dives.forEach((category, catIndex) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    // Category header
    pdf.setFillColor(79, 70, 229);
    pdf.roundedRect(20, yPosition, pageWidth - 40, 12, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(category.category_name, 25, yPosition + 8);
    
    const catScore = category.score?.toFixed(1) || '0.0';
    pdf.text(`${catScore}%`, pageWidth - 30, yPosition + 8, { align: 'right' });
    yPosition += 15;

    // Top 3 questions from category
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const topQuestions = category.questions?.slice(0, 3) || [];
    topQuestions.forEach((qa, qIndex) => {
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Q${qIndex + 1}: ${qa.question_text.substring(0, 80)}...`, 25, yPosition);
      yPosition += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Response: ${qa.response_text}`, 25, yPosition);
      yPosition += 6;

      pdf.setTextColor(0, 0, 0);
      const diagnosisText = pdf.splitTextToSize(qa.diagnosis?.substring(0, 150) || 'No diagnosis available', pageWidth - 50);
      pdf.text(diagnosisText, 25, yPosition);
      yPosition += diagnosisText.length * 5 + 8;
    });

    yPosition += 5;
  });

  return yPosition;
}

/**
 * Add recommendations section
 */
function addRecommendations(pdf, reportData, yPosition, pageWidth) {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Strategic Recommendations', 20, yPosition);
  yPosition += 12;

  // Quick wins
  if (reportData.ai_insights?.quick_wins && reportData.ai_insights.quick_wins.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Quick Wins - Start Here!', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    reportData.ai_insights.quick_wins.forEach((win, index) => {
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = 20;
      }

      // Win box
      pdf.setFillColor(240, 253, 244); // Light green
      pdf.roundedRect(20, yPosition, pageWidth - 40, 25, 3, 3, 'F');

      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${win.action}`, 25, yPosition + 7);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Impact: ${win.impact} | Effort: ${win.effort} | Timeline: ${win.timeline}`, 25, yPosition + 14);

      if (win.expected_outcome) {
        const outcomeText = pdf.splitTextToSize(win.expected_outcome, pageWidth - 50);
        pdf.text(outcomeText, 25, yPosition + 20);
      }

      yPosition += 30;
    });
  }

  return yPosition;
}

/**
 * Add consultation CTA page
 */
function addConsultationCTA(pdf, pageWidth, pageHeight) {
  // Orange/red gradient background
  pdf.setFillColor(249, 115, 22); // Orange
  pdf.rect(0, 0, pageWidth, pageHeight / 2, 'F');
  pdf.setFillColor(239, 68, 68); // Red
  pdf.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize('Save ₹8+ Crores Annually: Eliminate Factory Inefficiencies in 90 Days', pageWidth - 40);
  pdf.text(titleLines, pageWidth / 2, 40, { align: 'center' });

  // Guarantee box
  pdf.setFillColor(250, 204, 21); // Yellow
  pdf.roundedRect(30, 70, pageWidth - 60, 15, 3, 3, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🛡️ 50% Money Back Guarantee if we don\'t deliver 15% savings in 90 days!', pageWidth / 2, 80, { align: 'center' });

  // Results
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proven Results:', pageWidth / 2, 105, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('✓ 10+ Factories Transformed', pageWidth / 2, 120, { align: 'center' });
  pdf.text('✓ ₹500+ Cr Total Savings', pageWidth / 2, 130, { align: 'center' });
  pdf.text('✓ 98% Client Satisfaction', pageWidth / 2, 140, { align: 'center' });
  pdf.text('✓ 500%+ ROI in 12 Months', pageWidth / 2, 150, { align: 'center' });

  // CTA
  pdf.setFillColor(250, 204, 21); // Yellow
  pdf.roundedRect(40, 170, pageWidth - 80, 20, 5, 5, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📋 Claim Your Free Factory Audit', pageWidth / 2, 183, { align: 'center' });

  // Contact details
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Contact Us:', pageWidth / 2, 210, { align: 'center' });
  pdf.text('📞 +91-989-44-66-715', pageWidth / 2, 220, { align: 'center' });
  pdf.text('✉️ arjunm@navvicorp.com', pageWidth / 2, 230, { align: 'center' });
  pdf.text('📍 Avinashi Road, Tirupur', pageWidth / 2, 240, { align: 'center' });

  // Footer
  pdf.setFontSize(10);
  pdf.text('Visit: consulting.navvicorp.com', pageWidth / 2, 260, { align: 'center' });
}

export default { generateComprehensivePDF };

