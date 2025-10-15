"""
PDF Generation Service for Datrix™ Assessment Reports
Creates professional, branded PDF reports
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
import io

class PDFReportGenerator:
    """Generate professional PDF reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a365d'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))
        
        # Section header
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=14,
            textColor=colors.HexColor('#4a5568'),
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ))
        
        # Body text
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['BodyText'],
            fontSize=10,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            leading=14
        ))
        
        # Tier badge style
        self.styles.add(ParagraphStyle(
            name='TierBadge',
            parent=self.styles['Normal'],
            fontSize=18,
            textColor=colors.white,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
    
    def generate_pdf(self, report_data: dict, output_path: str):
        """Generate complete PDF report"""
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Add content sections
        elements.extend(self._create_cover_page(report_data))
        elements.append(PageBreak())
        
        elements.extend(self._create_executive_summary(report_data))
        elements.append(PageBreak())
        
        elements.extend(self._create_score_overview(report_data))
        elements.append(PageBreak())
        
        elements.extend(self._create_detailed_insights(report_data))
        elements.append(PageBreak())
        
        elements.extend(self._create_recommendations(report_data))
        elements.append(PageBreak())
        
        elements.extend(self._create_next_steps(report_data))
        
        # Build PDF
        doc.build(elements, onFirstPage=self._add_header_footer, 
                 onLaterPages=self._add_header_footer)
        
        return output_path
    
    def _create_cover_page(self, report_data: dict):
        """Create cover page"""
        elements = []
        
        # Title
        title = Paragraph("Datrix™ Business Intelligence Report", self.styles['CustomTitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.3*inch))
        
        # Company info
        company_info = f"""
        <para align=center fontSize=14>
        <b>{report_data['company_info']['name']}</b><br/>
        {report_data['company_info']['contact_person']}<br/>
        {report_data['company_info']['designation']}<br/>
        </para>
        """
        elements.append(Paragraph(company_info, self.styles['CustomBody']))
        elements.append(Spacer(1, 0.5*inch))
        
        # Overall score box
        score = report_data['assessment_info']['overall_score']
        tier = report_data['assessment_info']['overall_tier']
        
        score_data = [
            ['Overall Maturity Score', f"{score}%"],
            ['Performance Tier', tier],
            ['Assessment Date', report_data['assessment_info']['date']]
        ]
        
        score_table = Table(score_data, colWidths=[3*inch, 2*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f7fafc')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2d3748')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e0'))
        ]))
        
        elements.append(score_table)
        elements.append(Spacer(1, 0.5*inch))
        
        # Disclaimer
        disclaimer = """
        <para align=center fontSize=9 textColor=#718096>
        This report is confidential and intended solely for the use of the organization named above.
        The assessment is based on self-reported information and industry benchmarks.
        </para>
        """
        elements.append(Paragraph(disclaimer, self.styles['CustomBody']))
        
        return elements
    
    def _create_executive_summary(self, report_data: dict):
        """Create executive summary section"""
        elements = []
        
        # Section title
        title = Paragraph("Executive Summary", self.styles['CustomSubtitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Summary text
        summary = Paragraph(report_data['executive_summary'], self.styles['CustomBody'])
        elements.append(summary)
        
        return elements
    
    def _create_score_overview(self, report_data: dict):
        """Create score overview section"""
        elements = []
        
        # Section title
        title = Paragraph("Category Performance Overview", self.styles['CustomSubtitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Category scores table
        table_data = [['Category', 'Score', 'Performance Tier', 'Industry Benchmark']]
        
        for category, insights in report_data['category_insights'].items():
            category_name = category.replace('_', ' ').title()
            score = f"{insights['score']:.1f}%"
            tier = insights['tier']
            benchmark = "65%" # Industry average
            
            table_data.append([category_name, score, tier, benchmark])
        
        score_table = Table(table_data, colWidths=[2.5*inch, 1*inch, 1.5*inch, 1.5*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4a5568')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')])
        ]))
        
        elements.append(score_table)
        
        return elements
    
    def _create_detailed_insights(self, report_data: dict):
        """Create detailed insights for each category"""
        elements = []
        
        # Section title
        title = Paragraph("Detailed Category Insights", self.styles['CustomSubtitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        for category, insights in report_data['category_insights'].items():
            category_name = category.replace('_', ' ').title()
            
            # Category header
            header = Paragraph(f"{category_name} - {insights['tier']}", 
                             self.styles['SectionHeader'])
            elements.append(header)
            
            # Score
            score_text = f"<b>Score:</b> {insights['score']:.1f}%"
            elements.append(Paragraph(score_text, self.styles['CustomBody']))
            elements.append(Spacer(1, 0.1*inch))
            
            # Strengths
            elements.append(Paragraph("<b>Key Strengths:</b>", self.styles['CustomBody']))
            for strength in insights['strengths']:
                bullet = f"• {strength}"
                elements.append(Paragraph(bullet, self.styles['CustomBody']))
            
            elements.append(Spacer(1, 0.1*inch))
            
            # Opportunities
            elements.append(Paragraph("<b>Improvement Opportunities:</b>", 
                                    self.styles['CustomBody']))
            for opportunity in insights['opportunities']:
                bullet = f"• {opportunity}"
                elements.append(Paragraph(bullet, self.styles['CustomBody']))
            
            elements.append(Spacer(1, 0.2*inch))
        
        return elements
    
    def _create_recommendations(self, report_data: dict):
        """Create recommendations section"""
        elements = []
        
        # Section title
        title = Paragraph("Prioritized Recommendations", self.styles['CustomSubtitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Recommendations table
        table_data = [['Priority', 'Category', 'Recommendation', 'Impact']]
        
        for rec in report_data['recommendations']:
            table_data.append([
                rec['priority'],
                rec['category'],
                rec['recommendation'],
                rec['expected_impact']
            ])
        
        rec_table = Table(table_data, colWidths=[0.8*inch, 1.2*inch, 3.5*inch, 0.8*inch])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4a5568')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (3, 0), (3, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')]),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
        ]))
        
        elements.append(rec_table)
        
        return elements
    
    def _create_next_steps(self, report_data: dict):
        """Create next steps section"""
        elements = []
        
        # Section title
        title = Paragraph("Recommended Next Steps", self.styles['CustomSubtitle'])
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Next steps
        for idx, step in enumerate(report_data['next_steps'], 1):
            step_text = f"{idx}. {step}"
            elements.append(Paragraph(step_text, self.styles['CustomBody']))
            elements.append(Spacer(1, 0.1*inch))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Call to action
        cta = """
        <para align=center fontSize=12>
        <b>Ready to transform your business?</b><br/>
        Schedule a consultation with our experts to discuss your customized improvement roadmap.<br/><br/>
        <b>Navvi Corporations</b><br/>
        Email: support@navvicorp.com | Web: www.navvicorp.com
        </para>
        """
        elements.append(Paragraph(cta, self.styles['CustomBody']))
        
        return elements
    
    def _add_header_footer(self, canvas, doc):
        """Add header and footer to each page"""
        canvas.saveState()
        
        # Header
        canvas.setFont('Helvetica-Bold', 10)
        canvas.setFillColor(colors.HexColor('#4a5568'))
        canvas.drawString(72, letter[1] - 50, "Datrix™ Business Intelligence Report")
        canvas.line(72, letter[1] - 55, letter[0] - 72, letter[1] - 55)
        
        # Footer
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor('#718096'))
        canvas.drawString(72, 30, f"Generated on {datetime.now().strftime('%B %d, %Y')}")
        canvas.drawRightString(letter[0] - 72, 30, f"Page {doc.page}")
        canvas.drawCentredString(letter[0]/2, 30, "Confidential - Navvi Corporations")
        
        canvas.restoreState()

