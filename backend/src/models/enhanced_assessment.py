"""
Datrix™ Business Intelligence Scanner
Enhanced Assessment Model for Tirupur Garment Manufacturers & Exporters
Based on McKinsey, BCG, and industry best practices
"""

ASSESSMENT_FRAMEWORK = {
    "pillars": [
        {
            "id": "financial_health",
            "name": "Financial Health & Cost Management",
            "weight": 20,
            "description": "Financial stability, cost optimization, and profitability management"
        },
        {
            "id": "production_excellence",
            "name": "Production & Operational Excellence",
            "weight": 25,
            "description": "Manufacturing efficiency, quality, and technology adoption"
        },
        {
            "id": "supply_chain",
            "name": "Supply Chain & Sourcing",
            "weight": 15,
            "description": "Sourcing strategy, inventory management, and logistics"
        },
        {
            "id": "sales_marketing",
            "name": "Sales, Marketing & Customer Management",
            "weight": 20,
            "description": "Market reach, customer relationships, and brand positioning"
        },
        {
            "id": "compliance_sustainability",
            "name": "Compliance, Sustainability & Certifications",
            "weight": 10,
            "description": "Regulatory compliance, environmental standards, and certifications"
        },
        {
            "id": "human_capital",
            "name": "Human Capital & Organizational Development",
            "weight": 10,
            "description": "Workforce capability, training, and organizational culture"
        }
    ],
    
    "questions": [
        # PILLAR 1: Financial Health & Cost Management (12 questions)
        {
            "id": "fin_01",
            "pillar": "financial_health",
            "question": "What is your current working capital cycle (in days)?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_60", "label": "Less than 60 days", "score": 5},
                {"value": "60_to_90", "label": "60-90 days", "score": 4},
                {"value": "91_to_120", "label": "91-120 days", "score": 2},
                {"value": "more_than_120", "label": "More than 120 days", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 60 days",
                "good": "60-90 days",
                "average": "91-120 days",
                "poor": "> 120 days"
            },
            "interpretation": {
                "excellent": "Outstanding working capital management. Your cash conversion cycle is among the best in Tirupur's garment industry, enabling strong liquidity and growth potential.",
                "good": "Healthy working capital position. Minor optimization in receivables or inventory can further improve cash flow.",
                "average": "Working capital is stretched. Focus on reducing receivables days and optimizing inventory levels to free up cash.",
                "poor": "Critical liquidity risk. Immediate action needed: negotiate better payment terms with buyers, implement stricter credit control, and reduce slow-moving inventory."
            },
            "recommendations": {
                "excellent": ["Maintain current practices", "Consider early payment discounts", "Invest in growth opportunities"],
                "good": ["Implement automated receivables tracking", "Negotiate payment terms", "Review inventory turnover"],
                "average": ["Urgent: Implement cash flow forecasting", "Renegotiate buyer payment terms", "Reduce inventory holding"],
                "poor": ["Emergency: Seek working capital financing", "Implement daily cash monitoring", "Consider factoring/invoice discounting"]
            }
        },
        {
            "id": "fin_02",
            "pillar": "financial_health",
            "question": "Do you have sufficient cash reserves to cover at least 2 months of operational expenses?",
            "type": "single_choice",
            "options": [
                {"value": "yes_3plus", "label": "Yes, 3+ months covered", "score": 5},
                {"value": "yes_2months", "label": "Yes, 2-3 months covered", "score": 4},
                {"value": "yes_1month", "label": "Yes, 1-2 months covered", "score": 2},
                {"value": "no", "label": "No, less than 1 month", "score": 0}
            ],
            "benchmark": {
                "excellent": "3+ months",
                "good": "2-3 months",
                "average": "1-2 months",
                "poor": "< 1 month"
            },
            "interpretation": {
                "excellent": "Excellent financial buffer. You're well-positioned to handle market volatility and can invest in growth opportunities.",
                "good": "Adequate cash reserves for normal operations. Consider building further reserves for unexpected situations.",
                "average": "Limited financial cushion. Vulnerable to payment delays or order cancellations. Build reserves urgently.",
                "poor": "Severe liquidity risk. Any disruption in orders or payments could threaten operations. Immediate action required."
            },
            "recommendations": {
                "excellent": ["Maintain reserve levels", "Explore strategic investments", "Consider expansion opportunities"],
                "good": ["Build reserves to 3 months", "Implement cash forecasting", "Review cost structure"],
                "average": ["Priority: Build cash reserves", "Reduce discretionary spending", "Improve collection efficiency"],
                "poor": ["Emergency measures needed", "Seek emergency financing", "Implement strict cash controls", "Consider asset monetization"]
            }
        },
        {
            "id": "fin_03",
            "pillar": "financial_health",
            "question": "What is your current EBITDA margin?",
            "type": "single_choice",
            "options": [
                {"value": "above_15", "label": "Above 15%", "score": 5},
                {"value": "10_to_15", "label": "10-15%", "score": 4},
                {"value": "5_to_10", "label": "5-10%", "score": 2},
                {"value": "below_5", "label": "Below 5%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 15%",
                "good": "10-15%",
                "average": "5-10%",
                "poor": "< 5%"
            },
            "interpretation": {
                "excellent": "Industry-leading profitability. Strong pricing power and operational efficiency.",
                "good": "Healthy margins. Room for improvement through cost optimization and value addition.",
                "average": "Margins under pressure. Need to focus on cost reduction and value-added products.",
                "poor": "Unsustainable margins. Urgent need for business model review and cost restructuring."
            },
            "recommendations": {
                "excellent": ["Maintain competitive advantage", "Invest in innovation", "Expand premium product lines"],
                "good": ["Optimize material costs", "Improve production efficiency", "Enhance product mix"],
                "average": ["Conduct detailed cost analysis", "Renegotiate supplier contracts", "Reduce waste and rejections"],
                "poor": ["Emergency cost reduction program", "Review pricing strategy", "Consider product portfolio rationalization"]
            }
        },
        {
            "id": "fin_04",
            "pillar": "financial_health",
            "question": "Do you use any costing software or ERP system for accurate product costing?",
            "type": "single_choice",
            "options": [
                {"value": "advanced_erp", "label": "Yes, integrated ERP with real-time costing", "score": 5},
                {"value": "basic_software", "label": "Yes, basic costing software", "score": 3},
                {"value": "excel", "label": "Manual Excel-based costing", "score": 1},
                {"value": "no_system", "label": "No systematic costing", "score": 0}
            ],
            "benchmark": {
                "excellent": "Integrated ERP",
                "good": "Costing software",
                "average": "Excel-based",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Best-in-class cost management. Real-time visibility enables quick decision-making and competitive pricing.",
                "good": "Basic cost tracking in place. Upgrading to integrated system will improve accuracy and speed.",
                "average": "Manual processes prone to errors. Significant time spent on calculations instead of analysis.",
                "poor": "Flying blind on costs. Unable to price accurately or identify loss-making products."
            },
            "recommendations": {
                "excellent": ["Leverage data for predictive analytics", "Integrate with supply chain systems", "Use AI for cost optimization"],
                "good": ["Upgrade to integrated ERP", "Automate data collection", "Implement real-time dashboards"],
                "average": ["Implement basic costing software", "Standardize costing templates", "Train team on cost analysis"],
                "poor": ["Urgent: Implement basic costing system", "Hire/train cost accountant", "Establish standard costing procedures"]
            }
        },
        {
            "id": "fin_05",
            "pillar": "financial_health",
            "question": "How do you manage currency risk for export orders?",
            "type": "single_choice",
            "options": [
                {"value": "hedging", "label": "Active hedging through forwards/options", "score": 5},
                {"value": "natural_hedge", "label": "Natural hedging (matching inflows/outflows)", "score": 4},
                {"value": "buyer_clause", "label": "Currency clause in buyer contracts", "score": 2},
                {"value": "no_management", "label": "No active currency risk management", "score": 0}
            ],
            "benchmark": {
                "excellent": "Active hedging",
                "good": "Natural hedge/clauses",
                "average": "Partial protection",
                "poor": "No management"
            },
            "interpretation": {
                "excellent": "Sophisticated risk management. Protected from currency volatility, ensuring predictable margins.",
                "good": "Basic protection in place. Consider more active hedging for larger exposures.",
                "average": "Partial protection. Vulnerable to significant currency movements.",
                "poor": "Fully exposed to currency risk. Margins can swing dramatically with exchange rate changes."
            },
            "recommendations": {
                "excellent": ["Continue current strategy", "Review hedge ratios quarterly", "Explore dynamic hedging"],
                "good": ["Increase hedging coverage", "Use mix of instruments", "Monitor exposure daily"],
                "average": ["Implement basic hedging program", "Train finance team", "Set hedging policy"],
                "poor": ["Urgent: Engage forex advisor", "Start with forward contracts", "Establish risk management framework"]
            }
        },
        {
            "id": "fin_06",
            "pillar": "financial_health",
            "question": "What is your debt-to-equity ratio?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_1", "label": "Less than 1:1", "score": 5},
                {"value": "1_to_2", "label": "1:1 to 2:1", "score": 3},
                {"value": "2_to_3", "label": "2:1 to 3:1", "score": 1},
                {"value": "above_3", "label": "Above 3:1", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 1:1",
                "good": "1:1 to 2:1",
                "average": "2:1 to 3:1",
                "poor": "> 3:1"
            },
            "interpretation": {
                "excellent": "Conservative capital structure. Strong financial flexibility and low financial risk.",
                "good": "Balanced leverage. Reasonable debt levels with manageable interest burden.",
                "average": "High leverage. Limited financial flexibility. Interest costs impacting profitability.",
                "poor": "Excessive debt burden. High financial risk. Difficulty in raising additional capital."
            },
            "recommendations": {
                "excellent": ["Maintain healthy balance", "Consider growth investments", "Optimize capital structure"],
                "good": ["Monitor debt levels", "Focus on debt reduction", "Improve interest coverage"],
                "average": ["Priority: Reduce debt", "Refinance high-cost debt", "Improve profitability"],
                "poor": ["Emergency: Debt restructuring", "Asset monetization", "Seek equity infusion"]
            }
        },
        {
            "id": "fin_07",
            "pillar": "financial_health",
            "question": "Do you conduct regular variance analysis (actual vs. budgeted costs)?",
            "type": "single_choice",
            "options": [
                {"value": "weekly", "label": "Yes, weekly analysis", "score": 5},
                {"value": "monthly", "label": "Yes, monthly analysis", "score": 4},
                {"value": "quarterly", "label": "Yes, quarterly analysis", "score": 2},
                {"value": "no", "label": "No regular analysis", "score": 0}
            ],
            "benchmark": {
                "excellent": "Weekly",
                "good": "Monthly",
                "average": "Quarterly",
                "poor": "No analysis"
            },
            "interpretation": {
                "excellent": "Proactive cost management. Quick identification and correction of cost overruns.",
                "good": "Regular monitoring in place. Can improve frequency for faster response.",
                "average": "Delayed cost visibility. Issues identified too late for timely correction.",
                "poor": "No cost control. Operating without financial discipline or accountability."
            },
            "recommendations": {
                "excellent": ["Maintain rigor", "Implement predictive analytics", "Automate variance reporting"],
                "good": ["Increase frequency to weekly", "Automate data collection", "Set variance thresholds"],
                "average": ["Implement monthly reviews", "Establish budget discipline", "Train managers on variance analysis"],
                "poor": ["Start with basic budgeting", "Implement monthly tracking", "Hire/train finance personnel"]
            }
        },
        {
            "id": "fin_08",
            "pillar": "financial_health",
            "question": "What percentage of your receivables are overdue by more than 90 days?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_5", "label": "Less than 5%", "score": 5},
                {"value": "5_to_15", "label": "5-15%", "score": 3},
                {"value": "15_to_30", "label": "15-30%", "score": 1},
                {"value": "above_30", "label": "Above 30%", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 5%",
                "good": "5-15%",
                "average": "15-30%",
                "poor": "> 30%"
            },
            "interpretation": {
                "excellent": "Excellent credit management. Strong buyer relationships and effective collection processes.",
                "good": "Manageable receivables. Some buyers need closer monitoring.",
                "average": "Significant collection issues. Cash flow under pressure from delayed payments.",
                "poor": "Severe bad debt risk. Immediate action needed to prevent write-offs."
            },
            "recommendations": {
                "excellent": ["Maintain collection discipline", "Share best practices", "Consider early payment discounts"],
                "good": ["Strengthen collection process", "Implement aging analysis", "Review credit terms"],
                "average": ["Urgent: Escalate collections", "Review buyer creditworthiness", "Consider factoring"],
                "poor": ["Emergency collections drive", "Legal action if needed", "Implement credit insurance"]
            }
        },
        {
            "id": "fin_09",
            "pillar": "financial_health",
            "question": "Do you have access to export credit facilities (pre-shipment/post-shipment finance)?",
            "type": "single_choice",
            "options": [
                {"value": "multiple_banks", "label": "Yes, from multiple banks with competitive rates", "score": 5},
                {"value": "single_bank", "label": "Yes, from one bank", "score": 3},
                {"value": "limited", "label": "Limited access, high interest rates", "score": 1},
                {"value": "no_access", "label": "No access to export credit", "score": 0}
            ],
            "benchmark": {
                "excellent": "Multiple banks",
                "good": "Single bank",
                "average": "Limited access",
                "poor": "No access"
            },
            "interpretation": {
                "excellent": "Strong banking relationships. Competitive financing enabling growth and better margins.",
                "good": "Basic financing in place. Diversifying banking relationships can improve terms.",
                "average": "Constrained financing. High costs impacting competitiveness.",
                "poor": "Severe financing constraint. Unable to take large orders or grow business."
            },
            "recommendations": {
                "excellent": ["Leverage relationships for better terms", "Explore supply chain financing", "Negotiate volume discounts"],
                "good": ["Develop relationships with additional banks", "Negotiate better rates", "Explore ECGC coverage"],
                "average": ["Improve financial documentation", "Approach multiple banks", "Consider MSME schemes"],
                "poor": ["Urgent: Engage banking consultant", "Improve financial statements", "Explore government schemes"]
            }
        },
        {
            "id": "fin_10",
            "pillar": "financial_health",
            "question": "What is your inventory turnover ratio (times per year)?",
            "type": "single_choice",
            "options": [
                {"value": "above_8", "label": "Above 8 times", "score": 5},
                {"value": "6_to_8", "label": "6-8 times", "score": 4},
                {"value": "4_to_6", "label": "4-6 times", "score": 2},
                {"value": "below_4", "label": "Below 4 times", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 8 times",
                "good": "6-8 times",
                "average": "4-6 times",
                "poor": "< 4 times"
            },
            "interpretation": {
                "excellent": "Excellent inventory management. Capital efficiently deployed, minimal obsolescence risk.",
                "good": "Healthy turnover. Minor improvements possible through better planning.",
                "average": "Slow-moving inventory. Working capital locked up, increasing holding costs.",
                "poor": "Critical inventory issues. High obsolescence risk, significant capital blocked."
            },
            "recommendations": {
                "excellent": ["Maintain lean inventory", "Implement just-in-time practices", "Share best practices"],
                "good": ["Optimize reorder points", "Improve demand forecasting", "Reduce safety stock"],
                "average": ["Conduct inventory audit", "Implement ABC analysis", "Liquidate slow-moving items"],
                "poor": ["Emergency: Clear dead stock", "Implement inventory management system", "Revise procurement policies"]
            }
        },
        {
            "id": "fin_11",
            "pillar": "financial_health",
            "question": "Do you track cost per unit for each product/style?",
            "type": "single_choice",
            "options": [
                {"value": "detailed_tracking", "label": "Yes, detailed tracking with variance analysis", "score": 5},
                {"value": "basic_tracking", "label": "Yes, basic cost tracking", "score": 3},
                {"value": "estimated", "label": "Estimated costs only", "score": 1},
                {"value": "no_tracking", "label": "No systematic tracking", "score": 0}
            ],
            "benchmark": {
                "excellent": "Detailed tracking",
                "good": "Basic tracking",
                "average": "Estimates",
                "poor": "No tracking"
            },
            "interpretation": {
                "excellent": "Sophisticated cost management. Can identify profitable products and optimize mix.",
                "good": "Basic cost visibility. Need more granular analysis for better decision-making.",
                "average": "Limited cost insight. Difficult to price accurately or identify loss-makers.",
                "poor": "Operating without cost discipline. Unable to make informed pricing or product decisions."
            },
            "recommendations": {
                "excellent": ["Use data for strategic decisions", "Implement activity-based costing", "Benchmark against competition"],
                "good": ["Add variance analysis", "Track cost drivers", "Implement standard costing"],
                "average": ["Implement basic cost tracking", "Train team on cost accounting", "Use costing templates"],
                "poor": ["Urgent: Start tracking costs", "Hire cost accountant", "Implement basic costing system"]
            }
        },
        {
            "id": "fin_12",
            "pillar": "financial_health",
            "question": "Have you experienced interest cost increases in the last 6 months?",
            "type": "single_choice",
            "options": [
                {"value": "decreased", "label": "No, interest costs have decreased", "score": 5},
                {"value": "stable", "label": "No, costs are stable", "score": 4},
                {"value": "slight_increase", "label": "Yes, slight increase (< 1%)", "score": 2},
                {"value": "significant_increase", "label": "Yes, significant increase (> 1%)", "score": 0}
            ],
            "benchmark": {
                "excellent": "Decreased",
                "good": "Stable",
                "average": "Slight increase",
                "poor": "Significant increase"
            },
            "interpretation": {
                "excellent": "Improving credit profile. Banks competing for your business with better rates.",
                "good": "Stable borrowing costs. Maintaining good banking relationships.",
                "average": "Rising costs impacting margins. May indicate credit concerns or market conditions.",
                "poor": "Severe cost pressure. Possible credit rating downgrade or financial stress signals."
            },
            "recommendations": {
                "excellent": ["Leverage position for better terms", "Refinance old debt", "Explore new banking relationships"],
                "good": ["Monitor market rates", "Maintain financial discipline", "Negotiate proactively"],
                "average": ["Understand reasons for increase", "Improve financial metrics", "Explore refinancing options"],
                "poor": ["Urgent: Address financial concerns", "Improve credit profile", "Consider debt restructuring"]
            }
        },
        
        # PILLAR 2: Production & Operational Excellence (15 questions)
        {
            "id": "prod_01",
            "pillar": "production_excellence",
            "question": "What is your current production capacity utilization?",
            "type": "single_choice",
            "options": [
                {"value": "85_to_95", "label": "85-95% (optimal range)", "score": 5},
                {"value": "75_to_85", "label": "75-85%", "score": 4},
                {"value": "60_to_75", "label": "60-75%", "score": 2},
                {"value": "below_60", "label": "Below 60%", "score": 0}
            ],
            "benchmark": {
                "excellent": "85-95%",
                "good": "75-85%",
                "average": "60-75%",
                "poor": "< 60%"
            },
            "interpretation": {
                "excellent": "Optimal capacity utilization. Maximizing fixed cost recovery without overstraining resources.",
                "good": "Healthy utilization. Room to take additional orders without major investments.",
                "average": "Underutilized capacity. High fixed costs per unit impacting competitiveness.",
                "poor": "Severe underutilization. Urgent need for order book improvement or capacity rationalization."
            },
            "recommendations": {
                "excellent": ["Maintain optimal levels", "Plan for capacity expansion", "Optimize product mix"],
                "good": ["Target 85%+ utilization", "Improve sales pipeline", "Reduce changeover times"],
                "average": ["Urgent: Improve order book", "Enhance marketing efforts", "Consider capacity sharing"],
                "poor": ["Emergency: Rationalize capacity", "Aggressive sales push", "Consider contract manufacturing"]
            }
        },
        {
            "id": "prod_02",
            "pillar": "production_excellence",
            "question": "What is your average rejection rate (internal + buyer rejection)?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_1", "label": "Less than 1%", "score": 5},
                {"value": "1_to_3", "label": "1-3%", "score": 3},
                {"value": "3_to_5", "label": "3-5%", "score": 1},
                {"value": "above_5", "label": "Above 5%", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 1%",
                "good": "1-3%",
                "average": "3-5%",
                "poor": "> 5%"
            },
            "interpretation": {
                "excellent": "World-class quality. Strong competitive advantage and customer satisfaction.",
                "good": "Acceptable quality levels. Minor improvements can enhance profitability.",
                "average": "Quality issues impacting costs and reputation. Need systematic improvement.",
                "poor": "Severe quality problems. Threatening business viability and customer relationships."
            },
            "recommendations": {
                "excellent": ["Maintain quality standards", "Document best practices", "Pursue premium buyers"],
                "good": ["Target < 1% rejection", "Implement root cause analysis", "Enhance training"],
                "average": ["Urgent: Quality improvement program", "Implement SPC", "Enhance inspection"],
                "poor": ["Emergency: Stop-the-line authority", "Comprehensive quality overhaul", "Engage quality consultant"]
            }
        },
        {
            "id": "prod_03",
            "pillar": "production_excellence",
            "question": "Do you have an implemented Quality Management System (ISO 9001 or equivalent)?",
            "type": "single_choice",
            "options": [
                {"value": "certified_active", "label": "Yes, certified and actively maintained", "score": 5},
                {"value": "certified", "label": "Yes, certified but needs improvement", "score": 3},
                {"value": "in_process", "label": "Implementation in process", "score": 2},
                {"value": "no_system", "label": "No formal QMS", "score": 0}
            ],
            "benchmark": {
                "excellent": "Certified & active",
                "good": "Certified",
                "average": "In process",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Systematic quality management. Consistent processes and continuous improvement culture.",
                "good": "Basic quality framework. Need to strengthen implementation and monitoring.",
                "average": "Recognizing need for systematic approach. Progress being made.",
                "poor": "Ad-hoc quality management. Vulnerable to inconsistencies and errors."
            },
            "recommendations": {
                "excellent": ["Maintain certification", "Pursue advanced certifications", "Benchmark against best practices"],
                "good": ["Strengthen implementation", "Regular internal audits", "Train all employees"],
                "average": ["Accelerate implementation", "Engage consultant if needed", "Set certification timeline"],
                "poor": ["Priority: Implement basic QMS", "Start with 5S", "Train quality team"]
            }
        },
        {
            "id": "prod_04",
            "pillar": "production_excellence",
            "question": "What is your average on-time delivery performance?",
            "type": "single_choice",
            "options": [
                {"value": "above_95", "label": "Above 95%", "score": 5},
                {"value": "90_to_95", "label": "90-95%", "score": 4},
                {"value": "80_to_90", "label": "80-90%", "score": 2},
                {"value": "below_80", "label": "Below 80%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 95%",
                "good": "90-95%",
                "average": "80-90%",
                "poor": "< 80%"
            },
            "interpretation": {
                "excellent": "Outstanding delivery reliability. Strong competitive advantage and customer loyalty.",
                "good": "Good delivery performance. Minor improvements can enhance customer satisfaction.",
                "average": "Delivery issues affecting customer relationships. Need systematic improvement.",
                "poor": "Severe delivery problems. Losing customers and damaging reputation."
            },
            "recommendations": {
                "excellent": ["Maintain performance", "Share best practices", "Use as competitive advantage"],
                "good": ["Target 98%+ performance", "Analyze delay root causes", "Improve planning"],
                "average": ["Urgent: Improve production planning", "Implement tracking system", "Address bottlenecks"],
                "poor": ["Emergency: Delivery improvement program", "Daily monitoring", "Engage operations consultant"]
            }
        },
        {
            "id": "prod_05",
            "pillar": "production_excellence",
            "question": "What is your average lead time from order confirmation to shipment?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_30", "label": "Less than 30 days", "score": 5},
                {"value": "30_to_45", "label": "30-45 days", "score": 4},
                {"value": "45_to_60", "label": "45-60 days", "score": 2},
                {"value": "above_60", "label": "Above 60 days", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 30 days",
                "good": "30-45 days",
                "average": "45-60 days",
                "poor": "> 60 days"
            },
            "interpretation": {
                "excellent": "Fast turnaround time. Competitive advantage for quick-response orders and fast fashion.",
                "good": "Industry-standard lead time. Acceptable for most buyers.",
                "average": "Slow response time. Losing opportunities in fast-moving segments.",
                "poor": "Uncompetitive lead time. Unable to serve fast fashion or quick replenishment orders."
            },
            "recommendations": {
                "excellent": ["Maintain speed advantage", "Target premium fast-fashion buyers", "Implement quick response manufacturing"],
                "good": ["Reduce lead time further", "Optimize processes", "Improve supplier response"],
                "average": ["Urgent: Lead time reduction program", "Eliminate bottlenecks", "Improve planning"],
                "poor": ["Emergency: Process reengineering", "Implement lean manufacturing", "Engage operations consultant"]
            }
        },
        {
            "id": "prod_06",
            "pillar": "production_excellence",
            "question": "Do you use any production planning software or ERP system?",
            "type": "single_choice",
            "options": [
                {"value": "advanced_erp", "label": "Yes, integrated ERP with real-time tracking", "score": 5},
                {"value": "basic_software", "label": "Yes, basic production software", "score": 3},
                {"value": "excel", "label": "Manual Excel-based planning", "score": 1},
                {"value": "no_system", "label": "No systematic planning", "score": 0}
            ],
            "benchmark": {
                "excellent": "Integrated ERP",
                "good": "Production software",
                "average": "Excel-based",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Digital manufacturing. Real-time visibility enabling proactive management and quick decisions.",
                "good": "Basic digital tools. Upgrading to integrated system will improve efficiency.",
                "average": "Manual processes limiting efficiency. Difficult to scale or optimize.",
                "poor": "Operating without systematic planning. Frequent delays and inefficiencies."
            },
            "recommendations": {
                "excellent": ["Leverage data for AI/ML", "Integrate with supply chain", "Implement predictive maintenance"],
                "good": ["Upgrade to integrated ERP", "Add real-time tracking", "Implement mobile access"],
                "average": ["Implement production planning software", "Digitize processes", "Train team"],
                "poor": ["Urgent: Implement basic planning system", "Standardize processes", "Hire/train planner"]
            }
        },
        {
            "id": "prod_07",
            "pillar": "production_excellence",
            "question": "What percentage of your machinery is automated or semi-automated?",
            "type": "single_choice",
            "options": [
                {"value": "above_70", "label": "Above 70%", "score": 5},
                {"value": "50_to_70", "label": "50-70%", "score": 4},
                {"value": "30_to_50", "label": "30-50%", "score": 2},
                {"value": "below_30", "label": "Below 30%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 70%",
                "good": "50-70%",
                "average": "30-50%",
                "poor": "< 30%"
            },
            "interpretation": {
                "excellent": "High automation level. Improved productivity, quality, and reduced labor dependency.",
                "good": "Moderate automation. Further investment can improve efficiency.",
                "average": "Low automation. High labor costs and quality variability.",
                "poor": "Minimal automation. Uncompetitive in productivity and struggling with labor availability."
            },
            "recommendations": {
                "excellent": ["Maintain technology edge", "Explore Industry 4.0", "Implement IoT sensors"],
                "good": ["Increase automation levels", "Prioritize bottleneck operations", "Explore government schemes"],
                "average": ["Develop automation roadmap", "Start with high-volume operations", "Seek technology financing"],
                "poor": ["Urgent: Technology upgrade plan", "Start with basic automation", "Engage technology consultant"]
            }
        },
        {
            "id": "prod_08",
            "pillar": "production_excellence",
            "question": "Do you have a preventive maintenance program for machinery?",
            "type": "single_choice",
            "options": [
                {"value": "systematic_pm", "label": "Yes, systematic preventive maintenance with tracking", "score": 5},
                {"value": "basic_pm", "label": "Yes, basic preventive maintenance", "score": 3},
                {"value": "reactive", "label": "Mostly reactive maintenance", "score": 1},
                {"value": "no_program", "label": "No systematic program", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic PM",
                "good": "Basic PM",
                "average": "Reactive",
                "poor": "No program"
            },
            "interpretation": {
                "excellent": "Proactive maintenance. Minimized downtime, extended equipment life, predictable costs.",
                "good": "Basic maintenance discipline. Can improve with better tracking and scheduling.",
                "average": "Reactive approach causing unexpected downtime and higher costs.",
                "poor": "No maintenance discipline. Frequent breakdowns, delivery delays, high repair costs."
            },
            "recommendations": {
                "excellent": ["Maintain program", "Implement predictive maintenance", "Track OEE metrics"],
                "good": ["Enhance PM program", "Implement CMMS", "Train maintenance team"],
                "average": ["Develop PM schedule", "Implement basic tracking", "Allocate maintenance budget"],
                "poor": ["Urgent: Start PM program", "Conduct equipment audit", "Hire/train maintenance staff"]
            }
        },
        {
            "id": "prod_09",
            "pillar": "production_excellence",
            "question": "What is your Overall Equipment Effectiveness (OEE)?",
            "type": "single_choice",
            "options": [
                {"value": "above_75", "label": "Above 75%", "score": 5},
                {"value": "60_to_75", "label": "60-75%", "score": 4},
                {"value": "45_to_60", "label": "45-60%", "score": 2},
                {"value": "below_45", "label": "Below 45% or not measured", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 75%",
                "good": "60-75%",
                "average": "45-60%",
                "poor": "< 45%"
            },
            "interpretation": {
                "excellent": "World-class manufacturing. Excellent availability, performance, and quality.",
                "good": "Good manufacturing efficiency. Room for improvement in specific areas.",
                "average": "Significant efficiency losses. Need systematic improvement program.",
                "poor": "Poor equipment utilization. Major losses in availability, performance, or quality."
            },
            "recommendations": {
                "excellent": ["Maintain performance", "Benchmark against global standards", "Share best practices"],
                "good": ["Target 80%+ OEE", "Focus on biggest losses", "Implement TPM"],
                "average": ["Start measuring OEE", "Identify major losses", "Implement improvement program"],
                "poor": ["Urgent: Start tracking OEE", "Conduct loss analysis", "Engage lean consultant"]
            }
        },
        {
            "id": "prod_10",
            "pillar": "production_excellence",
            "question": "Do you have a formal continuous improvement program (Kaizen, Lean, Six Sigma)?",
            "type": "single_choice",
            "options": [
                {"value": "active_program", "label": "Yes, active program with regular improvements", "score": 5},
                {"value": "basic_program", "label": "Yes, basic program", "score": 3},
                {"value": "ad_hoc", "label": "Ad-hoc improvements only", "score": 1},
                {"value": "no_program", "label": "No formal program", "score": 0}
            ],
            "benchmark": {
                "excellent": "Active program",
                "good": "Basic program",
                "average": "Ad-hoc",
                "poor": "No program"
            },
            "interpretation": {
                "excellent": "Culture of continuous improvement. Systematic waste elimination and efficiency gains.",
                "good": "Basic improvement culture. Need to strengthen and systematize.",
                "average": "Sporadic improvements. Missing opportunities for systematic gains.",
                "poor": "No improvement culture. Stagnant processes and declining competitiveness."
            },
            "recommendations": {
                "excellent": ["Maintain momentum", "Expand to suppliers", "Pursue operational excellence"],
                "good": ["Strengthen program", "Train more employees", "Set improvement targets"],
                "average": ["Launch formal program", "Train improvement team", "Start with 5S"],
                "poor": ["Urgent: Start improvement journey", "Engage lean consultant", "Train leadership"]
            }
        },
        {
            "id": "prod_11",
            "pillar": "production_excellence",
            "question": "What is your average SAM (Standard Allowed Minutes) efficiency?",
            "type": "single_choice",
            "options": [
                {"value": "above_85", "label": "Above 85%", "score": 5},
                {"value": "75_to_85", "label": "75-85%", "score": 4},
                {"value": "60_to_75", "label": "60-75%", "score": 2},
                {"value": "below_60", "label": "Below 60%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 85%",
                "good": "75-85%",
                "average": "60-75%",
                "poor": "< 60%"
            },
            "interpretation": {
                "excellent": "Excellent labor productivity. Competitive labor costs and high output.",
                "good": "Good productivity levels. Minor improvements possible through better methods.",
                "average": "Low productivity impacting costs. Need systematic improvement.",
                "poor": "Very low productivity. Uncompetitive labor costs threatening viability."
            },
            "recommendations": {
                "excellent": ["Maintain performance", "Implement advanced methods", "Share best practices"],
                "good": ["Target 90%+ efficiency", "Optimize line balancing", "Improve skill training"],
                "average": ["Urgent: Productivity improvement", "Conduct time studies", "Improve work methods"],
                "poor": ["Emergency: Productivity program", "Engage IE consultant", "Comprehensive training"]
            }
        },
        {
            "id": "prod_12",
            "pillar": "production_excellence",
            "question": "Do you conduct regular time and motion studies?",
            "type": "single_choice",
            "options": [
                {"value": "systematic", "label": "Yes, systematic studies with continuous optimization", "score": 5},
                {"value": "periodic", "label": "Yes, periodic studies", "score": 3},
                {"value": "occasional", "label": "Occasional studies only", "score": 1},
                {"value": "no_studies", "label": "No systematic studies", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic",
                "good": "Periodic",
                "average": "Occasional",
                "poor": "No studies"
            },
            "interpretation": {
                "excellent": "Scientific approach to productivity. Continuous method improvement and waste elimination.",
                "good": "Basic industrial engineering practices. Can improve frequency and application.",
                "average": "Limited IE practices. Missing opportunities for productivity gains.",
                "poor": "No scientific approach. Operating with inefficient methods and high waste."
            },
            "recommendations": {
                "excellent": ["Maintain rigor", "Implement digital IE tools", "Train more IE personnel"],
                "good": ["Increase study frequency", "Expand to all operations", "Implement findings faster"],
                "average": ["Start systematic studies", "Train IE team", "Implement basic methods"],
                "poor": ["Urgent: Hire/train IE personnel", "Start with critical operations", "Engage IE consultant"]
            }
        },
        {
            "id": "prod_13",
            "pillar": "production_excellence",
            "question": "What is your fabric utilization efficiency (cutting efficiency)?",
            "type": "single_choice",
            "options": [
                {"value": "above_90", "label": "Above 90%", "score": 5},
                {"value": "85_to_90", "label": "85-90%", "score": 4},
                {"value": "80_to_85", "label": "80-85%", "score": 2},
                {"value": "below_80", "label": "Below 80%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 90%",
                "good": "85-90%",
                "average": "80-85%",
                "poor": "< 80%"
            },
            "interpretation": {
                "excellent": "Excellent fabric utilization. Minimized waste, optimized costs, strong profitability.",
                "good": "Good utilization. Minor improvements possible through better marker planning.",
                "average": "Significant fabric waste. Impacting costs and profitability.",
                "poor": "Severe fabric waste. Major cost disadvantage and environmental impact."
            },
            "recommendations": {
                "excellent": ["Maintain performance", "Implement AI marker planning", "Share best practices"],
                "good": ["Target 92%+ efficiency", "Use CAD marker planning", "Train cutting team"],
                "average": ["Urgent: Improve marker planning", "Implement CAD system", "Reduce waste"],
                "poor": ["Emergency: Waste reduction program", "Implement basic marker planning", "Engage consultant"]
            }
        },
        {
            "id": "prod_14",
            "pillar": "production_excellence",
            "question": "Do you use CAD/CAM systems for pattern making and marker planning?",
            "type": "single_choice",
            "options": [
                {"value": "advanced_cad", "label": "Yes, advanced CAD/CAM with automatic marker planning", "score": 5},
                {"value": "basic_cad", "label": "Yes, basic CAD/CAM", "score": 3},
                {"value": "manual", "label": "Manual pattern making and marker planning", "score": 1},
                {"value": "no_system", "label": "No systematic approach", "score": 0}
            ],
            "benchmark": {
                "excellent": "Advanced CAD/CAM",
                "good": "Basic CAD/CAM",
                "average": "Manual",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Digital pattern engineering. Optimized fabric utilization, faster development, reduced errors.",
                "good": "Basic digital tools. Upgrading to advanced systems will improve efficiency.",
                "average": "Manual processes limiting efficiency and accuracy. Higher waste and longer development time.",
                "poor": "No systematic approach. High waste, errors, and slow product development."
            },
            "recommendations": {
                "excellent": ["Maintain technology edge", "Explore 3D design", "Integrate with PLM"],
                "good": ["Upgrade to advanced CAD", "Add automatic nesting", "Train team on advanced features"],
                "average": ["Implement CAD/CAM system", "Train pattern makers", "Start with basic system"],
                "poor": ["Urgent: Implement CAD system", "Train team", "Engage technology consultant"]
            }
        },
        {
            "id": "prod_15",
            "pillar": "production_excellence",
            "question": "Do you have a documented Standard Operating Procedure (SOP) for all critical processes?",
            "type": "single_choice",
            "options": [
                {"value": "comprehensive", "label": "Yes, comprehensive SOPs regularly updated", "score": 5},
                {"value": "basic", "label": "Yes, basic SOPs for key processes", "score": 3},
                {"value": "partial", "label": "Partial documentation only", "score": 1},
                {"value": "no_sops", "label": "No documented SOPs", "score": 0}
            ],
            "benchmark": {
                "excellent": "Comprehensive SOPs",
                "good": "Basic SOPs",
                "average": "Partial",
                "poor": "No SOPs"
            },
            "interpretation": {
                "excellent": "Process discipline and consistency. Easier training, quality control, and continuous improvement.",
                "good": "Basic process documentation. Need to expand coverage and keep updated.",
                "average": "Inconsistent processes. Quality variability and training challenges.",
                "poor": "No process discipline. High variability, errors, and dependency on individuals."
            },
            "recommendations": {
                "excellent": ["Maintain SOPs", "Digitize procedures", "Implement visual work instructions"],
                "good": ["Expand SOP coverage", "Regular reviews", "Train all employees"],
                "average": ["Develop SOPs for critical processes", "Standardize formats", "Assign ownership"],
                "poor": ["Urgent: Start SOP development", "Prioritize critical processes", "Engage process consultant"]
            }
        },
        
        # PILLAR 3: Supply Chain & Sourcing (10 questions)
        {
            "id": "sc_01",
            "pillar": "supply_chain",
            "question": "How many days of raw material inventory do you typically maintain?",
            "type": "single_choice",
            "options": [
                {"value": "15_to_30", "label": "15-30 days (optimal)", "score": 5},
                {"value": "30_to_45", "label": "30-45 days", "score": 4},
                {"value": "45_to_60", "label": "45-60 days", "score": 2},
                {"value": "above_60", "label": "Above 60 days", "score": 0}
            ],
            "benchmark": {
                "excellent": "15-30 days",
                "good": "30-45 days",
                "average": "45-60 days",
                "poor": "> 60 days"
            },
            "interpretation": {
                "excellent": "Optimal inventory levels. Balanced between availability and working capital efficiency.",
                "good": "Slightly high inventory. Minor optimization can free up working capital.",
                "average": "Excessive inventory. Significant working capital locked up, risk of obsolescence.",
                "poor": "Very high inventory. Severe working capital pressure, high holding costs, obsolescence risk."
            },
            "recommendations": {
                "excellent": ["Maintain optimal levels", "Implement JIT where possible", "Share best practices"],
                "good": ["Reduce to 20-25 days", "Improve demand forecasting", "Negotiate shorter lead times"],
                "average": ["Urgent: Reduce inventory", "Implement ABC analysis", "Improve supplier responsiveness"],
                "poor": ["Emergency: Liquidate excess stock", "Implement inventory management system", "Revise procurement policies"]
            }
        },
        {
            "id": "sc_02",
            "pillar": "supply_chain",
            "question": "What percentage of your fabric/trim suppliers are located within 200 km of your factory?",
            "type": "single_choice",
            "options": [
                {"value": "above_70", "label": "Above 70%", "score": 5},
                {"value": "50_to_70", "label": "50-70%", "score": 4},
                {"value": "30_to_50", "label": "30-50%", "score": 2},
                {"value": "below_30", "label": "Below 30%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 70%",
                "good": "50-70%",
                "average": "30-50%",
                "poor": "< 30%"
            },
            "interpretation": {
                "excellent": "Strong local sourcing. Quick response, lower logistics costs, easier quality control.",
                "good": "Moderate local sourcing. Balancing local availability with other factors.",
                "average": "Limited local sourcing. Higher logistics costs and longer lead times.",
                "poor": "Minimal local sourcing. High logistics costs, long lead times, difficult quality control."
            },
            "recommendations": {
                "excellent": ["Maintain local relationships", "Develop strategic partnerships", "Collaborate on innovation"],
                "good": ["Increase local sourcing", "Develop local supplier base", "Negotiate better terms"],
                "average": ["Identify local alternatives", "Develop new suppliers", "Balance cost vs. responsiveness"],
                "poor": ["Urgent: Develop local supply base", "Reduce dependency on distant suppliers", "Improve logistics"]
            }
        },
        {
            "id": "sc_03",
            "pillar": "supply_chain",
            "question": "Do you have long-term contracts or partnerships with key suppliers?",
            "type": "single_choice",
            "options": [
                {"value": "strategic_partnerships", "label": "Yes, strategic partnerships with shared goals", "score": 5},
                {"value": "long_term_contracts", "label": "Yes, long-term contracts", "score": 4},
                {"value": "preferred_suppliers", "label": "Preferred suppliers but no formal agreements", "score": 2},
                {"value": "transactional", "label": "Purely transactional relationships", "score": 0}
            ],
            "benchmark": {
                "excellent": "Strategic partnerships",
                "good": "Long-term contracts",
                "average": "Preferred suppliers",
                "poor": "Transactional"
            },
            "interpretation": {
                "excellent": "Collaborative supply chain. Better pricing, priority allocation, joint innovation.",
                "good": "Stable supplier base. Predictable supply and pricing.",
                "average": "Informal relationships. Limited leverage and priority.",
                "poor": "Transactional approach. No leverage, vulnerable to supply disruptions and price volatility."
            },
            "recommendations": {
                "excellent": ["Maintain partnerships", "Expand collaboration", "Joint innovation programs"],
                "good": ["Deepen relationships", "Explore strategic partnerships", "Share forecasts"],
                "average": ["Formalize key relationships", "Negotiate framework agreements", "Build trust"],
                "poor": ["Urgent: Develop supplier partnerships", "Identify strategic suppliers", "Move beyond price focus"]
            }
        },
        {
            "id": "sc_04",
            "pillar": "supply_chain",
            "question": "How do you manage fabric quality before cutting?",
            "type": "single_choice",
            "options": [
                {"value": "systematic_inspection", "label": "100% systematic inspection with 4-point system", "score": 5},
                {"value": "sampling", "label": "Statistical sampling inspection", "score": 3},
                {"value": "visual", "label": "Visual inspection only", "score": 1},
                {"value": "no_inspection", "label": "No systematic inspection", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic 100%",
                "good": "Sampling",
                "average": "Visual only",
                "poor": "No inspection"
            },
            "interpretation": {
                "excellent": "Rigorous quality control. Prevents defects from entering production, reduces rejections.",
                "good": "Basic quality checks. Can improve with more systematic approach.",
                "average": "Minimal quality control. High risk of defects in finished garments.",
                "poor": "No quality control. Frequent rejections, rework, and customer complaints."
            },
            "recommendations": {
                "excellent": ["Maintain standards", "Implement digital inspection", "Share data with suppliers"],
                "good": ["Increase inspection coverage", "Implement 4-point system", "Train inspectors"],
                "average": ["Implement systematic inspection", "Train inspection team", "Set acceptance standards"],
                "poor": ["Urgent: Start fabric inspection", "Hire/train inspectors", "Implement 4-point system"]
            }
        },
        {
            "id": "sc_05",
            "pillar": "supply_chain",
            "question": "What is your supplier on-time delivery performance?",
            "type": "single_choice",
            "options": [
                {"value": "above_95", "label": "Above 95%", "score": 5},
                {"value": "85_to_95", "label": "85-95%", "score": 4},
                {"value": "70_to_85", "label": "70-85%", "score": 2},
                {"value": "below_70", "label": "Below 70%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 95%",
                "good": "85-95%",
                "average": "70-85%",
                "poor": "< 70%"
            },
            "interpretation": {
                "excellent": "Reliable supply chain. Enables accurate production planning and on-time delivery.",
                "good": "Generally reliable. Minor delays manageable with buffer stock.",
                "average": "Frequent delays. Impacting production schedules and customer deliveries.",
                "poor": "Unreliable supply chain. Constant firefighting, missed deliveries, excess safety stock."
            },
            "recommendations": {
                "excellent": ["Maintain relationships", "Reduce safety stock", "Implement VMI"],
                "good": ["Improve supplier performance", "Share production schedules", "Implement penalties/incentives"],
                "average": ["Urgent: Supplier development program", "Measure and review performance", "Consider alternative suppliers"],
                "poor": ["Emergency: Diversify supplier base", "Implement strict monitoring", "Consider backward integration"]
            }
        },
        {
            "id": "sc_06",
            "pillar": "supply_chain",
            "question": "Do you have alternative suppliers for critical materials?",
            "type": "single_choice",
            "options": [
                {"value": "multiple_qualified", "label": "Yes, multiple qualified suppliers for all critical items", "score": 5},
                {"value": "some_alternatives", "label": "Yes, alternatives for some critical items", "score": 3},
                {"value": "identified", "label": "Alternatives identified but not qualified", "score": 1},
                {"value": "single_source", "label": "Single source for most items", "score": 0}
            ],
            "benchmark": {
                "excellent": "Multiple qualified",
                "good": "Some alternatives",
                "average": "Identified only",
                "poor": "Single source"
            },
            "interpretation": {
                "excellent": "Resilient supply chain. Protected from supplier disruptions, good negotiating leverage.",
                "good": "Partial resilience. Some vulnerability to supplier issues.",
                "average": "Limited resilience. Vulnerable to supplier disruptions.",
                "poor": "High supply chain risk. Completely dependent on single suppliers."
            },
            "recommendations": {
                "excellent": ["Maintain supplier diversity", "Regular supplier reviews", "Contingency planning"],
                "good": ["Qualify additional suppliers", "Expand dual sourcing", "Build relationships"],
                "average": ["Urgent: Qualify alternative suppliers", "Develop contingency plans", "Reduce single-source items"],
                "poor": ["Emergency: Diversify supply base", "Identify and qualify alternatives", "Implement risk management"]
            }
        },
        {
            "id": "sc_07",
            "pillar": "supply_chain",
            "question": "Do you use any supply chain management software or system?",
            "type": "single_choice",
            "options": [
                {"value": "integrated_scm", "label": "Yes, integrated SCM with supplier portal", "score": 5},
                {"value": "basic_software", "label": "Yes, basic inventory/procurement software", "score": 3},
                {"value": "excel", "label": "Manual Excel-based tracking", "score": 1},
                {"value": "no_system", "label": "No systematic tracking", "score": 0}
            ],
            "benchmark": {
                "excellent": "Integrated SCM",
                "good": "Basic software",
                "average": "Excel-based",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Digital supply chain. Real-time visibility, automated processes, data-driven decisions.",
                "good": "Basic digital tools. Upgrading will improve efficiency and visibility.",
                "average": "Manual processes. Limited visibility, slow response, prone to errors.",
                "poor": "No systematic management. Operating blind, frequent stockouts or excess inventory."
            },
            "recommendations": {
                "excellent": ["Leverage data analytics", "Implement AI forecasting", "Expand supplier collaboration"],
                "good": ["Upgrade to integrated SCM", "Add supplier portal", "Implement automated reordering"],
                "average": ["Implement SCM software", "Digitize processes", "Train procurement team"],
                "poor": ["Urgent: Implement basic system", "Standardize processes", "Hire/train procurement staff"]
            }
        },
        {
            "id": "sc_08",
            "pillar": "supply_chain",
            "question": "What is your average payment term with suppliers?",
            "type": "single_choice",
            "options": [
                {"value": "45_to_60", "label": "45-60 days", "score": 5},
                {"value": "30_to_45", "label": "30-45 days", "score": 4},
                {"value": "15_to_30", "label": "15-30 days", "score": 2},
                {"value": "advance", "label": "Advance or immediate payment", "score": 0}
            ],
            "benchmark": {
                "excellent": "45-60 days",
                "good": "30-45 days",
                "average": "15-30 days",
                "poor": "Advance/immediate"
            },
            "interpretation": {
                "excellent": "Favorable payment terms. Strong working capital position and supplier relationships.",
                "good": "Reasonable payment terms. Balanced working capital management.",
                "average": "Short payment terms. Working capital under pressure.",
                "poor": "Advance payments required. Severe working capital strain, weak negotiating position."
            },
            "recommendations": {
                "excellent": ["Maintain terms", "Explore early payment discounts", "Optimize cash flow"],
                "good": ["Negotiate longer terms", "Build stronger relationships", "Improve creditworthiness"],
                "average": ["Urgent: Negotiate better terms", "Improve financial position", "Diversify suppliers"],
                "poor": ["Emergency: Improve creditworthiness", "Seek working capital finance", "Build supplier trust"]
            }
        },
        {
            "id": "sc_09",
            "pillar": "supply_chain",
            "question": "Do you conduct regular supplier audits or assessments?",
            "type": "single_choice",
            "options": [
                {"value": "systematic", "label": "Yes, systematic audits with scorecards", "score": 5},
                {"value": "periodic", "label": "Yes, periodic assessments", "score": 3},
                {"value": "occasional", "label": "Occasional visits only", "score": 1},
                {"value": "no_audits", "label": "No systematic audits", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic audits",
                "good": "Periodic assessments",
                "average": "Occasional",
                "poor": "No audits"
            },
            "interpretation": {
                "excellent": "Proactive supplier management. Early identification of risks, continuous improvement.",
                "good": "Basic supplier monitoring. Can improve frequency and depth.",
                "average": "Limited supplier visibility. Reactive problem-solving only.",
                "poor": "No supplier oversight. Vulnerable to quality, delivery, and compliance issues."
            },
            "recommendations": {
                "excellent": ["Maintain audit program", "Share improvement plans", "Collaborate on development"],
                "good": ["Increase audit frequency", "Implement scorecards", "Link to business allocation"],
                "average": ["Develop audit program", "Train audit team", "Set minimum standards"],
                "poor": ["Urgent: Start supplier audits", "Assess critical suppliers", "Engage consultant if needed"]
            }
        },
        {
            "id": "sc_10",
            "pillar": "supply_chain",
            "question": "What percentage of your logistics is outsourced vs. in-house?",
            "type": "single_choice",
            "options": [
                {"value": "optimal_mix", "label": "Optimal mix based on cost-benefit analysis", "score": 5},
                {"value": "mostly_outsourced", "label": "Mostly outsourced to 3PL", "score": 4},
                {"value": "mostly_inhouse", "label": "Mostly in-house", "score": 2},
                {"value": "ad_hoc", "label": "Ad-hoc without clear strategy", "score": 0}
            ],
            "benchmark": {
                "excellent": "Optimal mix",
                "good": "Strategic outsourcing",
                "average": "Mostly in-house",
                "poor": "Ad-hoc"
            },
            "interpretation": {
                "excellent": "Strategic logistics management. Optimized costs and service levels.",
                "good": "Leveraging 3PL expertise. Focus on core manufacturing competencies.",
                "average": "High logistics costs. Capital tied up in vehicles and infrastructure.",
                "poor": "Inefficient logistics. High costs, poor service, no clear strategy."
            },
            "recommendations": {
                "excellent": ["Maintain optimal mix", "Regular cost-benefit reviews", "Explore technology solutions"],
                "good": ["Optimize 3PL relationships", "Benchmark costs", "Improve visibility"],
                "average": ["Evaluate outsourcing options", "Conduct cost-benefit analysis", "Consider 3PL for non-core"],
                "poor": ["Urgent: Develop logistics strategy", "Engage logistics consultant", "Evaluate 3PL options"]
            }
        },
        
        # PILLAR 4: Sales, Marketing & Customer Management (10 questions)
        {
            "id": "sm_01",
            "pillar": "sales_marketing",
            "question": "What percentage of your revenue comes from your top 3 customers?",
            "type": "single_choice",
            "options": [
                {"value": "less_than_40", "label": "Less than 40%", "score": 5},
                {"value": "40_to_60", "label": "40-60%", "score": 4},
                {"value": "60_to_80", "label": "60-80%", "score": 2},
                {"value": "above_80", "label": "Above 80%", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 40%",
                "good": "40-60%",
                "average": "60-80%",
                "poor": "> 80%"
            },
            "interpretation": {
                "excellent": "Well-diversified customer base. Low dependency risk, strong negotiating position.",
                "good": "Moderate diversification. Some concentration risk manageable.",
                "average": "High customer concentration. Vulnerable to loss of major customer.",
                "poor": "Severe concentration risk. Business viability dependent on few customers."
            },
            "recommendations": {
                "excellent": ["Maintain diversification", "Continue new customer development", "Leverage position for better terms"],
                "good": ["Further diversify", "Develop new customers", "Reduce concentration"],
                "average": ["Urgent: Customer diversification program", "Aggressive new customer development", "Reduce dependency"],
                "poor": ["Emergency: Diversify immediately", "Intensive sales efforts", "Consider new markets/products"]
            }
        },
        {
            "id": "sm_02",
            "pillar": "sales_marketing",
            "question": "How many countries do you currently export to?",
            "type": "single_choice",
            "options": [
                {"value": "above_10", "label": "Above 10 countries", "score": 5},
                {"value": "5_to_10", "label": "5-10 countries", "score": 4},
                {"value": "2_to_5", "label": "2-5 countries", "score": 2},
                {"value": "1_country", "label": "1 country only", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 10 countries",
                "good": "5-10 countries",
                "average": "2-5 countries",
                "poor": "1 country"
            },
            "interpretation": {
                "excellent": "Strong geographic diversification. Protected from regional market downturns.",
                "good": "Moderate geographic spread. Some diversification benefits.",
                "average": "Limited geographic reach. Vulnerable to regional economic issues.",
                "poor": "Single market dependency. High risk from country-specific issues."
            },
            "recommendations": {
                "excellent": ["Maintain presence", "Deepen relationships", "Explore emerging markets"],
                "good": ["Expand to new markets", "Increase market share", "Diversify further"],
                "average": ["Urgent: Geographic expansion", "Participate in trade fairs", "Develop new markets"],
                "poor": ["Emergency: Market diversification", "Engage export consultant", "Leverage government schemes"]
            }
        },
        {
            "id": "sm_03",
            "pillar": "sales_marketing",
            "question": "Do you have a dedicated sales and marketing team?",
            "type": "single_choice",
            "options": [
                {"value": "professional_team", "label": "Yes, professional team with clear targets", "score": 5},
                {"value": "basic_team", "label": "Yes, basic team", "score": 3},
                {"value": "owner_led", "label": "Owner-led sales only", "score": 1},
                {"value": "no_team", "label": "No dedicated team", "score": 0}
            ],
            "benchmark": {
                "excellent": "Professional team",
                "good": "Basic team",
                "average": "Owner-led",
                "poor": "No team"
            },
            "interpretation": {
                "excellent": "Professional sales organization. Systematic customer development and relationship management.",
                "good": "Basic sales capability. Can strengthen with training and systems.",
                "average": "Owner dependency. Limited bandwidth for growth, succession risk.",
                "poor": "No sales capability. Unable to grow or develop new customers systematically."
            },
            "recommendations": {
                "excellent": ["Maintain team", "Invest in training", "Implement CRM system"],
                "good": ["Strengthen team", "Set clear targets", "Implement sales processes"],
                "average": ["Hire sales professionals", "Train team", "Reduce owner dependency"],
                "poor": ["Urgent: Build sales team", "Hire experienced professionals", "Implement basic processes"]
            }
        },
        {
            "id": "sm_04",
            "pillar": "sales_marketing",
            "question": "Do you participate in international trade fairs or exhibitions?",
            "type": "single_choice",
            "options": [
                {"value": "regular_participation", "label": "Yes, regularly (2+ times/year)", "score": 5},
                {"value": "occasional", "label": "Yes, occasionally", "score": 3},
                {"value": "rarely", "label": "Rarely", "score": 1},
                {"value": "never", "label": "Never", "score": 0}
            ],
            "benchmark": {
                "excellent": "Regular participation",
                "good": "Occasional",
                "average": "Rarely",
                "poor": "Never"
            },
            "interpretation": {
                "excellent": "Active market presence. Strong brand visibility, regular new customer contacts.",
                "good": "Some market presence. Can increase frequency for better results.",
                "average": "Limited market visibility. Missing opportunities for customer development.",
                "poor": "No market presence. Invisible to potential customers, dependent on existing relationships."
            },
            "recommendations": {
                "excellent": ["Maintain participation", "Maximize ROI from fairs", "Consider own booth"],
                "good": ["Increase frequency", "Target key fairs", "Improve follow-up"],
                "average": ["Participate in major fairs", "Leverage government support", "Prepare professionally"],
                "poor": ["Urgent: Start participating", "Join group pavilions", "Leverage AEPC support"]
            }
        },
        {
            "id": "sm_05",
            "pillar": "sales_marketing",
            "question": "Do you have a company website with product catalog?",
            "type": "single_choice",
            "options": [
                {"value": "professional_website", "label": "Yes, professional website with online catalog and inquiry system", "score": 5},
                {"value": "basic_website", "label": "Yes, basic website", "score": 3},
                {"value": "under_development", "label": "Under development", "score": 1},
                {"value": "no_website", "label": "No website", "score": 0}
            ],
            "benchmark": {
                "excellent": "Professional website",
                "good": "Basic website",
                "average": "Under development",
                "poor": "No website"
            },
            "interpretation": {
                "excellent": "Strong digital presence. 24/7 accessibility, professional image, lead generation.",
                "good": "Basic online presence. Can enhance with better content and functionality.",
                "average": "Recognizing digital importance. Need to complete and launch.",
                "poor": "No digital presence. Invisible to online buyers, unprofessional image."
            },
            "recommendations": {
                "excellent": ["Maintain website", "Add e-commerce", "Implement SEO/SEM"],
                "good": ["Enhance website", "Add product catalog", "Improve mobile experience"],
                "average": ["Complete website development", "Add professional content", "Make mobile-friendly"],
                "poor": ["Urgent: Develop website", "Engage web developer", "Start with basic site"]
            }
        },
        {
            "id": "sm_06",
            "pillar": "sales_marketing",
            "question": "Do you use digital marketing (LinkedIn, Google Ads, etc.) to reach buyers?",
            "type": "single_choice",
            "options": [
                {"value": "active_campaigns", "label": "Yes, active digital marketing campaigns", "score": 5},
                {"value": "basic_presence", "label": "Yes, basic social media presence", "score": 3},
                {"value": "exploring", "label": "Exploring options", "score": 1},
                {"value": "no_digital", "label": "No digital marketing", "score": 0}
            ],
            "benchmark": {
                "excellent": "Active campaigns",
                "good": "Basic presence",
                "average": "Exploring",
                "poor": "No digital"
            },
            "interpretation": {
                "excellent": "Modern marketing approach. Reaching global buyers cost-effectively, generating leads.",
                "good": "Basic digital presence. Can enhance with paid campaigns and content marketing.",
                "average": "Recognizing digital importance. Need to start implementation.",
                "poor": "Traditional approach only. Missing opportunities in digital buyer journey."
            },
            "recommendations": {
                "excellent": ["Maintain campaigns", "Optimize ROI", "Expand channels"],
                "good": ["Launch paid campaigns", "Create content strategy", "Engage digital agency"],
                "average": ["Start with LinkedIn presence", "Learn digital basics", "Allocate budget"],
                "poor": ["Urgent: Establish digital presence", "Train team", "Engage digital consultant"]
            }
        },
        {
            "id": "sm_07",
            "pillar": "sales_marketing",
            "question": "What is your customer retention rate?",
            "type": "single_choice",
            "options": [
                {"value": "above_85", "label": "Above 85%", "score": 5},
                {"value": "70_to_85", "label": "70-85%", "score": 4},
                {"value": "50_to_70", "label": "50-70%", "score": 2},
                {"value": "below_50", "label": "Below 50%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 85%",
                "good": "70-85%",
                "average": "50-70%",
                "poor": "< 50%"
            },
            "interpretation": {
                "excellent": "Strong customer relationships. High satisfaction, repeat business, stable revenue.",
                "good": "Good customer loyalty. Some attrition manageable.",
                "average": "High customer churn. Constant need for new customer acquisition.",
                "poor": "Severe retention issues. Underlying quality, service, or competitiveness problems."
            },
            "recommendations": {
                "excellent": ["Maintain relationships", "Deepen partnerships", "Expand wallet share"],
                "good": ["Improve retention", "Address churn reasons", "Enhance service"],
                "average": ["Urgent: Retention program", "Understand churn reasons", "Improve quality/service"],
                "poor": ["Emergency: Address root causes", "Customer feedback program", "Service recovery"]
            }
        },
        {
            "id": "sm_08",
            "pillar": "sales_marketing",
            "question": "Do you have a Customer Relationship Management (CRM) system?",
            "type": "single_choice",
            "options": [
                {"value": "advanced_crm", "label": "Yes, advanced CRM with analytics", "score": 5},
                {"value": "basic_crm", "label": "Yes, basic CRM", "score": 3},
                {"value": "excel", "label": "Excel-based tracking", "score": 1},
                {"value": "no_system", "label": "No systematic tracking", "score": 0}
            ],
            "benchmark": {
                "excellent": "Advanced CRM",
                "good": "Basic CRM",
                "average": "Excel-based",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Systematic customer management. Data-driven decisions, personalized service, no lost opportunities.",
                "good": "Basic customer tracking. Can enhance with better analytics and automation.",
                "average": "Manual tracking. Limited visibility, missed opportunities, no analytics.",
                "poor": "No customer management. Operating blind, lost opportunities, poor service."
            },
            "recommendations": {
                "excellent": ["Leverage CRM data", "Implement AI insights", "Integrate with other systems"],
                "good": ["Upgrade CRM", "Add analytics", "Train team on advanced features"],
                "average": ["Implement CRM system", "Digitize customer data", "Train sales team"],
                "poor": ["Urgent: Implement basic CRM", "Start tracking interactions", "Build customer database"]
            }
        },
        {
            "id": "sm_09",
            "pillar": "sales_marketing",
            "question": "What is your average order value trend over the last year?",
            "type": "single_choice",
            "options": [
                {"value": "increasing", "label": "Increasing", "score": 5},
                {"value": "stable", "label": "Stable", "score": 4},
                {"value": "slightly_decreasing", "label": "Slightly decreasing", "score": 2},
                {"value": "significantly_decreasing", "label": "Significantly decreasing", "score": 0}
            ],
            "benchmark": {
                "excellent": "Increasing",
                "good": "Stable",
                "average": "Slightly decreasing",
                "poor": "Significantly decreasing"
            },
            "interpretation": {
                "excellent": "Growing customer confidence. Increasing wallet share, stronger relationships.",
                "good": "Stable business. Maintaining customer relationships and order sizes.",
                "average": "Declining order sizes. Possible competitiveness or relationship issues.",
                "poor": "Severe decline. Customers reducing business, possible loss of confidence."
            },
            "recommendations": {
                "excellent": ["Maintain momentum", "Expand product offerings", "Deepen relationships"],
                "good": ["Grow order sizes", "Cross-sell products", "Improve service"],
                "average": ["Understand decline reasons", "Address competitiveness", "Improve value proposition"],
                "poor": ["Emergency: Customer feedback", "Address root causes", "Service recovery program"]
            }
        },
        {
            "id": "sm_10",
            "pillar": "sales_marketing",
            "question": "Do you have a formal process for handling customer complaints?",
            "type": "single_choice",
            "options": [
                {"value": "systematic_process", "label": "Yes, systematic process with root cause analysis", "score": 5},
                {"value": "basic_process", "label": "Yes, basic complaint handling", "score": 3},
                {"value": "ad_hoc", "label": "Ad-hoc handling", "score": 1},
                {"value": "no_process", "label": "No formal process", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic process",
                "good": "Basic process",
                "average": "Ad-hoc",
                "poor": "No process"
            },
            "interpretation": {
                "excellent": "Professional complaint management. Quick resolution, learning from issues, customer satisfaction.",
                "good": "Basic complaint handling. Can improve with systematic approach and analysis.",
                "average": "Inconsistent handling. Some issues unresolved, no learning.",
                "poor": "No complaint management. Customer dissatisfaction, repeat issues, relationship damage."
            },
            "recommendations": {
                "excellent": ["Maintain process", "Share learnings", "Prevent recurrence"],
                "good": ["Enhance process", "Add root cause analysis", "Track metrics"],
                "average": ["Implement formal process", "Train team", "Set response standards"],
                "poor": ["Urgent: Establish complaint process", "Assign ownership", "Set resolution timelines"]
            }
        },
        
        # PILLAR 5: Compliance, Sustainability & Certifications (8 questions)
        {
            "id": "cs_01",
            "pillar": "compliance_sustainability",
            "question": "Which of the following certifications do you currently hold?",
            "type": "multiple_choice",
            "options": [
                {"value": "gots", "label": "GOTS (Global Organic Textile Standard)", "score": 1},
                {"value": "oeko_tex", "label": "OEKO-TEX Standard 100", "score": 1},
                {"value": "bci", "label": "BCI (Better Cotton Initiative)", "score": 1},
                {"value": "sa8000", "label": "SA8000 (Social Accountability)", "score": 1},
                {"value": "wrap", "label": "WRAP (Worldwide Responsible Accredited Production)", "score": 1},
                {"value": "sedex", "label": "SEDEX/SMETA", "score": 1},
                {"value": "iso14001", "label": "ISO 14001 (Environmental Management)", "score": 1},
                {"value": "none", "label": "None of the above", "score": 0}
            ],
            "benchmark": {
                "excellent": "4+ certifications",
                "good": "2-3 certifications",
                "average": "1 certification",
                "poor": "No certifications"
            },
            "interpretation": {
                "excellent": "Comprehensive certification portfolio. Access to premium buyers, competitive advantage.",
                "good": "Basic certifications. Can expand to access more buyers.",
                "average": "Minimal certification. Limited access to premium buyers.",
                "poor": "No certifications. Excluded from many buyer requirements, competitive disadvantage."
            },
            "recommendations": {
                "excellent": ["Maintain certifications", "Pursue advanced standards", "Leverage as competitive advantage"],
                "good": ["Add key certifications", "Based on buyer requirements", "Plan certification roadmap"],
                "average": ["Priority: Obtain key certifications", "Start with buyer requirements", "Leverage government support"],
                "poor": ["Urgent: Start certification journey", "Assess buyer requirements", "Engage certification consultant"]
            }
        },
        {
            "id": "cs_02",
            "pillar": "compliance_sustainability",
            "question": "Do you have documented labor policies compliant with Indian labor laws?",
            "type": "single_choice",
            "options": [
                {"value": "comprehensive", "label": "Yes, comprehensive policies regularly updated", "score": 5},
                {"value": "basic", "label": "Yes, basic policies", "score": 3},
                {"value": "partial", "label": "Partial documentation", "score": 1},
                {"value": "no_policies", "label": "No documented policies", "score": 0}
            ],
            "benchmark": {
                "excellent": "Comprehensive policies",
                "good": "Basic policies",
                "average": "Partial",
                "poor": "No policies"
            },
            "interpretation": {
                "excellent": "Full labor compliance. Protected from legal issues, meets buyer audit requirements.",
                "good": "Basic compliance. Need to strengthen and update regularly.",
                "average": "Partial compliance. Vulnerable to legal issues and audit failures.",
                "poor": "Non-compliant. High risk of legal action, audit failures, buyer rejection."
            },
            "recommendations": {
                "excellent": ["Maintain compliance", "Regular policy reviews", "Train management"],
                "good": ["Strengthen policies", "Regular updates", "Implement monitoring"],
                "average": ["Develop comprehensive policies", "Engage labor consultant", "Train HR team"],
                "poor": ["Urgent: Establish labor policies", "Ensure legal compliance", "Engage legal/HR consultant"]
            }
        },
        {
            "id": "cs_03",
            "pillar": "compliance_sustainability",
            "question": "What percentage of your workforce is covered by ESI and PF?",
            "type": "single_choice",
            "options": [
                {"value": "100_percent", "label": "100% of eligible employees", "score": 5},
                {"value": "75_to_100", "label": "75-100%", "score": 3},
                {"value": "50_to_75", "label": "50-75%", "score": 1},
                {"value": "below_50", "label": "Below 50%", "score": 0}
            ],
            "benchmark": {
                "excellent": "100%",
                "good": "75-100%",
                "average": "50-75%",
                "poor": "< 50%"
            },
            "interpretation": {
                "excellent": "Full statutory compliance. Protected from legal issues, meets audit requirements.",
                "good": "Mostly compliant. Need to cover remaining employees.",
                "average": "Partial compliance. Legal and audit risk.",
                "poor": "Non-compliant. High risk of legal action, penalties, audit failures."
            },
            "recommendations": {
                "excellent": ["Maintain compliance", "Regular audits", "Timely payments"],
                "good": ["Cover all eligible employees", "Regular compliance checks", "Maintain records"],
                "average": ["Urgent: Improve coverage", "Register all eligible employees", "Ensure compliance"],
                "poor": ["Emergency: Achieve full compliance", "Engage compliance consultant", "Avoid legal penalties"]
            }
        },
        {
            "id": "cs_04",
            "pillar": "compliance_sustainability",
            "question": "Do you have an effluent treatment plant (ETP) or participate in CETP?",
            "type": "single_choice",
            "options": [
                {"value": "own_etp", "label": "Yes, own ETP with regular monitoring", "score": 5},
                {"value": "cetp", "label": "Yes, connected to CETP", "score": 4},
                {"value": "planning", "label": "Planning to implement", "score": 1},
                {"value": "no_treatment", "label": "No effluent treatment", "score": 0}
            ],
            "benchmark": {
                "excellent": "Own ETP",
                "good": "CETP",
                "average": "Planning",
                "poor": "No treatment"
            },
            "interpretation": {
                "excellent": "Full environmental compliance. Meeting discharge standards, sustainable operations.",
                "good": "Basic environmental compliance. Shared treatment facility.",
                "average": "Recognizing need. Need to implement urgently.",
                "poor": "Environmental non-compliance. Legal risk, buyer rejection, pollution."
            },
            "recommendations": {
                "excellent": ["Maintain ETP", "Regular monitoring", "Pursue zero discharge"],
                "good": ["Maintain CETP connection", "Monitor discharge quality", "Consider own ETP if expanding"],
                "average": ["Urgent: Implement treatment", "Connect to CETP", "Ensure compliance"],
                "poor": ["Emergency: Address immediately", "Connect to CETP", "Avoid legal action"]
            }
        },
        {
            "id": "cs_05",
            "pillar": "compliance_sustainability",
            "question": "What percentage of your energy comes from renewable sources?",
            "type": "single_choice",
            "options": [
                {"value": "above_30", "label": "Above 30%", "score": 5},
                {"value": "15_to_30", "label": "15-30%", "score": 4},
                {"value": "5_to_15", "label": "5-15%", "score": 2},
                {"value": "below_5", "label": "Below 5%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 30%",
                "good": "15-30%",
                "average": "5-15%",
                "poor": "< 5%"
            },
            "interpretation": {
                "excellent": "Strong sustainability commitment. Reduced carbon footprint, lower energy costs, buyer preference.",
                "good": "Good renewable adoption. Can increase further for better sustainability.",
                "average": "Limited renewable energy. Missing cost savings and sustainability benefits.",
                "poor": "Minimal renewable energy. High carbon footprint, missing buyer sustainability requirements."
            },
            "recommendations": {
                "excellent": ["Maintain renewable focus", "Target carbon neutrality", "Share sustainability story"],
                "good": ["Increase renewable percentage", "Explore solar/wind", "Leverage government incentives"],
                "average": ["Implement renewable energy", "Start with solar rooftop", "Explore PPAs"],
                "poor": ["Urgent: Start renewable journey", "Assess solar potential", "Engage renewable consultant"]
            }
        },
        {
            "id": "cs_06",
            "pillar": "compliance_sustainability",
            "question": "Do you have a documented chemical management system?",
            "type": "single_choice",
            "options": [
                {"value": "comprehensive", "label": "Yes, comprehensive system with MRSL compliance", "score": 5},
                {"value": "basic", "label": "Yes, basic chemical tracking", "score": 3},
                {"value": "partial", "label": "Partial tracking", "score": 1},
                {"value": "no_system", "label": "No systematic management", "score": 0}
            ],
            "benchmark": {
                "excellent": "Comprehensive system",
                "good": "Basic tracking",
                "average": "Partial",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Full chemical compliance. MRSL adherence, meets buyer requirements, safe operations.",
                "good": "Basic chemical management. Need to strengthen for buyer requirements.",
                "average": "Limited chemical control. Risk of non-compliance and safety issues.",
                "poor": "No chemical management. High risk of buyer rejection, safety issues, environmental violations."
            },
            "recommendations": {
                "excellent": ["Maintain system", "Regular audits", "Stay updated on MRSL"],
                "good": ["Strengthen system", "Ensure MRSL compliance", "Implement testing"],
                "average": ["Develop chemical management system", "Train team", "Implement MRSL"],
                "poor": ["Urgent: Establish chemical management", "Engage consultant", "Ensure compliance"]
            }
        },
        {
            "id": "cs_07",
            "pillar": "compliance_sustainability",
            "question": "Do you have a workplace safety program with regular training?",
            "type": "single_choice",
            "options": [
                {"value": "comprehensive", "label": "Yes, comprehensive program with regular training and audits", "score": 5},
                {"value": "basic", "label": "Yes, basic safety measures", "score": 3},
                {"value": "minimal", "label": "Minimal safety measures", "score": 1},
                {"value": "no_program", "label": "No systematic program", "score": 0}
            ],
            "benchmark": {
                "excellent": "Comprehensive program",
                "good": "Basic measures",
                "average": "Minimal",
                "poor": "No program"
            },
            "interpretation": {
                "excellent": "Strong safety culture. Protected workers, meets audit requirements, low accident rates.",
                "good": "Basic safety in place. Can strengthen with more training and monitoring.",
                "average": "Limited safety focus. Risk of accidents and audit failures.",
                "poor": "No safety program. High risk of accidents, legal issues, audit failures."
            },
            "recommendations": {
                "excellent": ["Maintain program", "Pursue zero accidents", "Share best practices"],
                "good": ["Strengthen program", "Increase training frequency", "Implement safety audits"],
                "average": ["Develop safety program", "Train employees", "Implement basic measures"],
                "poor": ["Urgent: Establish safety program", "Engage safety consultant", "Prevent accidents"]
            }
        },
        {
            "id": "cs_08",
            "pillar": "compliance_sustainability",
            "question": "How do you manage fabric and production waste?",
            "type": "single_choice",
            "options": [
                {"value": "recycling_program", "label": "Comprehensive recycling and upcycling program", "score": 5},
                {"value": "segregation", "label": "Waste segregation and sale to recyclers", "score": 3},
                {"value": "basic_disposal", "label": "Basic disposal practices", "score": 1},
                {"value": "no_management", "label": "No systematic waste management", "score": 0}
            ],
            "benchmark": {
                "excellent": "Recycling program",
                "good": "Segregation",
                "average": "Basic disposal",
                "poor": "No management"
            },
            "interpretation": {
                "excellent": "Circular economy approach. Waste reduction, revenue from waste, environmental sustainability.",
                "good": "Basic waste management. Can enhance with recycling and upcycling.",
                "average": "Minimal waste management. Missing revenue opportunities and sustainability benefits.",
                "poor": "No waste management. Environmental issues, missing revenue, buyer concerns."
            },
            "recommendations": {
                "excellent": ["Maintain program", "Pursue zero waste", "Share sustainability story"],
                "good": ["Enhance recycling", "Explore upcycling", "Measure waste reduction"],
                "average": ["Implement waste segregation", "Identify recycling partners", "Reduce waste generation"],
                "poor": ["Urgent: Start waste management", "Segregate waste", "Engage waste consultant"]
            }
        },
        
        # PILLAR 6: Human Capital & Organizational Development (8 questions)
        {
            "id": "hc_01",
            "pillar": "human_capital",
            "question": "What is your employee turnover rate (annual)?",
            "type": "single_choice",
            "options": [
                {"value": "below_15", "label": "Below 15%", "score": 5},
                {"value": "15_to_30", "label": "15-30%", "score": 4},
                {"value": "30_to_50", "label": "30-50%", "score": 2},
                {"value": "above_50", "label": "Above 50%", "score": 0}
            ],
            "benchmark": {
                "excellent": "< 15%",
                "good": "15-30%",
                "average": "30-50%",
                "poor": "> 50%"
            },
            "interpretation": {
                "excellent": "Excellent employee retention. Stable workforce, low recruitment costs, high productivity.",
                "good": "Acceptable turnover. Some attrition manageable.",
                "average": "High turnover. Constant recruitment, training costs, productivity loss.",
                "poor": "Severe turnover crisis. Unable to maintain stable workforce, quality and delivery issues."
            },
            "recommendations": {
                "excellent": ["Maintain culture", "Share best practices", "Focus on development"],
                "good": ["Reduce turnover", "Improve engagement", "Address attrition reasons"],
                "average": ["Urgent: Retention program", "Improve working conditions", "Competitive compensation"],
                "poor": ["Emergency: Address root causes", "Improve workplace", "Engage HR consultant"]
            }
        },
        {
            "id": "hc_02",
            "pillar": "human_capital",
            "question": "Do you have a structured training program for employees?",
            "type": "single_choice",
            "options": [
                {"value": "comprehensive", "label": "Yes, comprehensive program with regular training", "score": 5},
                {"value": "basic", "label": "Yes, basic on-the-job training", "score": 3},
                {"value": "ad_hoc", "label": "Ad-hoc training only", "score": 1},
                {"value": "no_training", "label": "No structured training", "score": 0}
            ],
            "benchmark": {
                "excellent": "Comprehensive program",
                "good": "Basic training",
                "average": "Ad-hoc",
                "poor": "No training"
            },
            "interpretation": {
                "excellent": "Strong learning culture. Skilled workforce, improved productivity, employee engagement.",
                "good": "Basic training in place. Can strengthen with structured programs.",
                "average": "Limited skill development. Productivity and quality issues.",
                "poor": "No training. Unskilled workforce, low productivity, high errors."
            },
            "recommendations": {
                "excellent": ["Maintain program", "Expand to new skills", "Measure training ROI"],
                "good": ["Strengthen program", "Add structured modules", "Increase frequency"],
                "average": ["Develop training program", "Leverage government schemes", "Train trainers"],
                "poor": ["Urgent: Start training program", "Engage training partner", "Focus on critical skills"]
            }
        },
        {
            "id": "hc_03",
            "pillar": "human_capital",
            "question": "What percentage of your supervisors have formal technical training?",
            "type": "single_choice",
            "options": [
                {"value": "above_75", "label": "Above 75%", "score": 5},
                {"value": "50_to_75", "label": "50-75%", "score": 4},
                {"value": "25_to_50", "label": "25-50%", "score": 2},
                {"value": "below_25", "label": "Below 25%", "score": 0}
            ],
            "benchmark": {
                "excellent": "> 75%",
                "good": "50-75%",
                "average": "25-50%",
                "poor": "< 25%"
            },
            "interpretation": {
                "excellent": "Skilled supervision. Effective line management, quality control, problem-solving.",
                "good": "Moderate supervisor skills. Can improve with more training.",
                "average": "Limited supervisor capability. Quality and efficiency issues.",
                "poor": "Unskilled supervision. Poor line management, quality problems, low productivity."
            },
            "recommendations": {
                "excellent": ["Maintain skill levels", "Advanced training", "Succession planning"],
                "good": ["Train remaining supervisors", "Certification programs", "Continuous development"],
                "average": ["Urgent: Supervisor training", "Leverage NIFT/ATDC programs", "Structured development"],
                "poor": ["Emergency: Supervisor development", "Engage training institute", "Hire skilled supervisors"]
            }
        },
        {
            "id": "hc_04",
            "pillar": "human_capital",
            "question": "Do you have a performance management system with regular reviews?",
            "type": "single_choice",
            "options": [
                {"value": "systematic", "label": "Yes, systematic performance management with KPIs", "score": 5},
                {"value": "annual_reviews", "label": "Yes, annual performance reviews", "score": 3},
                {"value": "informal", "label": "Informal feedback only", "score": 1},
                {"value": "no_system", "label": "No performance management", "score": 0}
            ],
            "benchmark": {
                "excellent": "Systematic with KPIs",
                "good": "Annual reviews",
                "average": "Informal",
                "poor": "No system"
            },
            "interpretation": {
                "excellent": "Performance-driven culture. Clear expectations, accountability, continuous improvement.",
                "good": "Basic performance management. Can improve with more frequent reviews and KPIs.",
                "average": "Limited performance focus. Unclear expectations, no accountability.",
                "poor": "No performance management. No accountability, unclear expectations, poor performance."
            },
            "recommendations": {
                "excellent": ["Maintain system", "Link to development", "Continuous feedback"],
                "good": ["Strengthen system", "Add KPIs", "Increase review frequency"],
                "average": ["Implement performance system", "Set clear expectations", "Regular reviews"],
                "poor": ["Urgent: Establish performance management", "Define KPIs", "Engage HR consultant"]
            }
        },
        {
            "id": "hc_05",
            "pillar": "human_capital",
            "question": "Do you have a succession plan for key positions?",
            "type": "single_choice",
            "options": [
                {"value": "documented_plan", "label": "Yes, documented succession plan with development programs", "score": 5},
                {"value": "identified_successors", "label": "Yes, successors identified", "score": 3},
                {"value": "informal", "label": "Informal thinking only", "score": 1},
                {"value": "no_plan", "label": "No succession planning", "score": 0}
            ],
            "benchmark": {
                "excellent": "Documented plan",
                "good": "Identified successors",
                "average": "Informal",
                "poor": "No plan"
            },
            "interpretation": {
                "excellent": "Future-ready organization. Protected from key person risk, developed talent pipeline.",
                "good": "Basic succession thinking. Need to formalize and develop successors.",
                "average": "Limited succession planning. Vulnerable to key person loss.",
                "poor": "No succession planning. High risk from key person dependency, no talent pipeline."
            },
            "recommendations": {
                "excellent": ["Maintain plan", "Regular reviews", "Accelerate development"],
                "good": ["Formalize succession plan", "Develop successors", "Document process"],
                "average": ["Identify critical positions", "Identify potential successors", "Development plans"],
                "poor": ["Urgent: Start succession planning", "Identify key risks", "Engage HR consultant"]
            }
        },
        {
            "id": "hc_06",
            "pillar": "human_capital",
            "question": "What is the average age of your workforce?",
            "type": "single_choice",
            "options": [
                {"value": "balanced", "label": "Balanced mix of age groups", "score": 5},
                {"value": "mostly_young", "label": "Mostly young (< 35 years)", "score": 3},
                {"value": "mostly_experienced", "label": "Mostly experienced (> 45 years)", "score": 3},
                {"value": "skewed", "label": "Heavily skewed to one age group", "score": 0}
            ],
            "benchmark": {
                "excellent": "Balanced mix",
                "good": "Slight skew",
                "average": "Moderate skew",
                "poor": "Heavy skew"
            },
            "interpretation": {
                "excellent": "Balanced workforce. Mix of energy and experience, knowledge transfer, succession pipeline.",
                "good": "Slight age imbalance. Manageable with targeted hiring.",
                "average": "Age imbalance. Need to balance energy and experience.",
                "poor": "Severe age imbalance. Risk of mass retirement or lack of experience."
            },
            "recommendations": {
                "excellent": ["Maintain balance", "Knowledge transfer programs", "Succession planning"],
                "good": ["Balance workforce", "Targeted hiring", "Knowledge management"],
                "average": ["Address age imbalance", "Hire for balance", "Knowledge transfer"],
                "poor": ["Urgent: Balance workforce", "Succession planning", "Knowledge documentation"]
            }
        },
        {
            "id": "hc_07",
            "pillar": "human_capital",
            "question": "Do you have employee welfare programs (canteen, transport, healthcare)?",
            "type": "multiple_choice",
            "options": [
                {"value": "canteen", "label": "Subsidized canteen", "score": 1},
                {"value": "transport", "label": "Employee transport", "score": 1},
                {"value": "healthcare", "label": "Healthcare/medical support", "score": 1},
                {"value": "housing", "label": "Housing support", "score": 1},
                {"value": "childcare", "label": "Childcare facilities", "score": 1},
                {"value": "none", "label": "None of the above", "score": 0}
            ],
            "benchmark": {
                "excellent": "4+ programs",
                "good": "2-3 programs",
                "average": "1 program",
                "poor": "No programs"
            },
            "interpretation": {
                "excellent": "Comprehensive employee welfare. Strong retention, high satisfaction, competitive advantage in hiring.",
                "good": "Basic welfare programs. Can expand to improve retention.",
                "average": "Minimal welfare. Limited employee satisfaction and retention.",
                "poor": "No employee welfare. High turnover, difficulty in hiring, low morale."
            },
            "recommendations": {
                "excellent": ["Maintain programs", "Gather employee feedback", "Continuous improvement"],
                "good": ["Expand welfare programs", "Based on employee needs", "Improve existing programs"],
                "average": ["Implement key welfare programs", "Start with canteen/transport", "Assess employee needs"],
                "poor": ["Urgent: Start welfare programs", "Prioritize based on impact", "Improve retention"]
            }
        },
        {
            "id": "hc_08",
            "pillar": "human_capital",
            "question": "Do you conduct employee satisfaction surveys?",
            "type": "single_choice",
            "options": [
                {"value": "regular_surveys", "label": "Yes, regular surveys with action plans", "score": 5},
                {"value": "annual_survey", "label": "Yes, annual survey", "score": 3},
                {"value": "occasional", "label": "Occasional feedback", "score": 1},
                {"value": "no_surveys", "label": "No systematic feedback", "score": 0}
            ],
            "benchmark": {
                "excellent": "Regular surveys",
                "good": "Annual survey",
                "average": "Occasional",
                "poor": "No surveys"
            },
            "interpretation": {
                "excellent": "Employee-centric culture. Listening to employees, continuous improvement, high engagement.",
                "good": "Basic employee feedback. Can improve frequency and action planning.",
                "average": "Limited employee voice. Missing insights on satisfaction and issues.",
                "poor": "No employee feedback. Operating blind on employee satisfaction, retention risks."
            },
            "recommendations": {
                "excellent": ["Maintain surveys", "Act on feedback", "Close feedback loop"],
                "good": ["Increase survey frequency", "Improve action planning", "Communicate results"],
                "average": ["Implement annual survey", "Act on feedback", "Build trust"],
                "poor": ["Urgent: Start employee surveys", "Simple feedback mechanism", "Act on inputs"]
            }
        }
    ]
}

# Scoring and grading system
SCORING_SYSTEM = {
    "max_score": 300,  # 63 questions × ~5 points average
    "grades": {
        "A+": {"min": 90, "max": 100, "label": "Excellent", "color": "#10b981"},
        "A": {"min": 80, "max": 89, "label": "Very Good", "color": "#22c55e"},
        "B+": {"min": 70, "max": 79, "label": "Good", "color": "#84cc16"},
        "B": {"min": 60, "max": 69, "label": "Above Average", "color": "#eab308"},
        "C": {"min": 50, "max": 59, "label": "Average", "color": "#f59e0b"},
        "D": {"min": 40, "max": 49, "label": "Below Average", "color": "#f97316"},
        "F": {"min": 0, "max": 39, "label": "Needs Urgent Improvement", "color": "#ef4444"}
    }
}

# Industry benchmarks for Tirupur garment sector
INDUSTRY_BENCHMARKS = {
    "financial_health": {
        "top_performers": {"min": 90, "description": "Export turnover ₹100+ Cr, EBITDA > 15%, Working capital < 60 days"},
        "good_performers": {"min": 70, "description": "Export turnover ₹25-100 Cr, EBITDA 10-15%, Working capital 60-90 days"},
        "average_performers": {"min": 50, "description": "Export turnover ₹5-25 Cr, EBITDA 5-10%, Working capital 91-120 days"},
        "needs_improvement": {"min": 0, "description": "Export turnover < ₹5 Cr, EBITDA < 5%, Working capital > 120 days"}
    },
    "production_excellence": {
        "top_performers": {"min": 90, "description": "Capacity utilization 85-95%, Rejection < 1%, OTD > 95%, SAM efficiency > 85%"},
        "good_performers": {"min": 70, "description": "Capacity utilization 75-85%, Rejection 1-3%, OTD 90-95%, SAM efficiency 75-85%"},
        "average_performers": {"min": 50, "description": "Capacity utilization 60-75%, Rejection 3-5%, OTD 80-90%, SAM efficiency 60-75%"},
        "needs_improvement": {"min": 0, "description": "Capacity utilization < 60%, Rejection > 5%, OTD < 80%, SAM efficiency < 60%"}
    },
    "supply_chain": {
        "top_performers": {"min": 90, "description": "Inventory turnover > 8x, Supplier OTD > 95%, Local sourcing > 70%"},
        "good_performers": {"min": 70, "description": "Inventory turnover 6-8x, Supplier OTD 85-95%, Local sourcing 50-70%"},
        "average_performers": {"min": 50, "description": "Inventory turnover 4-6x, Supplier OTD 70-85%, Local sourcing 30-50%"},
        "needs_improvement": {"min": 0, "description": "Inventory turnover < 4x, Supplier OTD < 70%, Local sourcing < 30%"}
    },
    "sales_marketing": {
        "top_performers": {"min": 90, "description": "Customer diversification (top 3 < 40%), 10+ export countries, Retention > 85%"},
        "good_performers": {"min": 70, "description": "Customer diversification (top 3 40-60%), 5-10 countries, Retention 70-85%"},
        "average_performers": {"min": 50, "description": "Customer diversification (top 3 60-80%), 2-5 countries, Retention 50-70%"},
        "needs_improvement": {"min": 0, "description": "Customer concentration (top 3 > 80%), 1 country, Retention < 50%"}
    },
    "compliance_sustainability": {
        "top_performers": {"min": 90, "description": "4+ certifications, 100% labor compliance, Renewable energy > 30%"},
        "good_performers": {"min": 70, "description": "2-3 certifications, Good labor compliance, Renewable energy 15-30%"},
        "average_performers": {"min": 50, "description": "1 certification, Basic compliance, Renewable energy 5-15%"},
        "needs_improvement": {"min": 0, "description": "No certifications, Compliance gaps, Renewable energy < 5%"}
    },
    "human_capital": {
        "top_performers": {"min": 90, "description": "Turnover < 15%, Comprehensive training, Performance management, Welfare programs"},
        "good_performers": {"min": 70, "description": "Turnover 15-30%, Basic training, Annual reviews, Some welfare"},
        "average_performers": {"min": 50, "description": "Turnover 30-50%, Ad-hoc training, Informal feedback, Minimal welfare"},
        "needs_improvement": {"min": 0, "description": "Turnover > 50%, No training, No performance management, No welfare"}
    }
}

def calculate_assessment_score(answers):
    """Calculate comprehensive assessment score"""
    total_score = 0
    max_possible = 0
    pillar_scores = {}
    
    for question in ASSESSMENT_FRAMEWORK["questions"]:
        q_id = question["id"]
        if q_id in answers:
            answer = answers[q_id]
            pillar = question["pillar"]
            
            if question["type"] == "single_choice":
                for option in question["options"]:
                    if option["value"] == answer:
                        score = option["score"]
                        total_score += score
                        max_possible += 5
                        
                        if pillar not in pillar_scores:
                            pillar_scores[pillar] = {"score": 0, "max": 0}
                        pillar_scores[pillar]["score"] += score
                        pillar_scores[pillar]["max"] += 5
                        break
            
            elif question["type"] == "multiple_choice":
                for selected in answer:
                    for option in question["options"]:
                        if option["value"] == selected:
                            score = option["score"]
                            total_score += score
                            break
                max_possible += sum(opt["score"] for opt in question["options"] if opt["value"] != "none")
                
                if pillar not in pillar_scores:
                    pillar_scores[pillar] = {"score": 0, "max": 0}
                pillar_scores[pillar]["score"] += total_score
                pillar_scores[pillar]["max"] += max_possible
    
    percentage = (total_score / max_possible * 100) if max_possible > 0 else 0
    
    # Determine grade
    grade = "F"
    for g, criteria in SCORING_SYSTEM["grades"].items():
        if criteria["min"] <= percentage <= criteria["max"]:
            grade = g
            break
    
    return {
        "total_score": total_score,
        "max_possible": max_possible,
        "percentage": round(percentage, 2),
        "grade": grade,
        "pillar_scores": pillar_scores
    }


# Export for API use
ENHANCED_ASSESSMENT_QUESTIONS = ASSESSMENT_FRAMEWORK
