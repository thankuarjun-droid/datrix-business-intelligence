"""
Professional Assessment Report Generator for Datrix™
Generates comprehensive PDF reports with insights and benchmarks
"""

from datetime import datetime
from typing import Dict, List
import json

class ReportGenerator:
    """Generate professional assessment reports with industry benchmarks"""
    
    # Industry benchmarks for Tirupur garment manufacturers
    INDUSTRY_BENCHMARKS = {
        'operational_excellence': {
            'world_class': 85,
            'industry_leader': 75,
            'competitive': 65,
            'developing': 50,
            'emerging': 35
        },
        'digital_transformation': {
            'world_class': 80,
            'industry_leader': 70,
            'competitive': 60,
            'developing': 45,
            'emerging': 30
        },
        'supply_chain': {
            'world_class': 85,
            'industry_leader': 75,
            'competitive': 65,
            'developing': 50,
            'emerging': 35
        },
        'sustainability': {
            'world_class': 80,
            'industry_leader': 70,
            'competitive': 60,
            'developing': 45,
            'emerging': 30
        },
        'quality_compliance': {
            'world_class': 90,
            'industry_leader': 80,
            'competitive': 70,
            'developing': 55,
            'emerging': 40
        },
        'financial_performance': {
            'world_class': 85,
            'industry_leader': 75,
            'competitive': 65,
            'developing': 50,
            'emerging': 35
        }
    }
    
    @staticmethod
    def calculate_category_scores(answers: Dict) -> Dict:
        """Calculate scores for each assessment category"""
        category_scores = {}
        category_counts = {}
        
        for question_id, answer in answers.items():
            # Extract category from question_id (format: category_subcategory_number)
            parts = question_id.split('_')
            if len(parts) >= 2:
                category = parts[0]
                
                if category not in category_scores:
                    category_scores[category] = 0
                    category_counts[category] = 0
                
                # Convert answer to score (assuming 0-4 scale)
                score = answer if isinstance(answer, (int, float)) else 0
                category_scores[category] += score
                category_counts[category] += 1
        
        # Calculate percentages
        category_percentages = {}
        for category, total_score in category_scores.items():
            max_score = category_counts[category] * 4  # Assuming 4 is max per question
            percentage = (total_score / max_score * 100) if max_score > 0 else 0
            category_percentages[category] = round(percentage, 1)
        
        return category_percentages
    
    @staticmethod
    def get_performance_tier(score: float, category: str) -> str:
        """Determine performance tier based on score and benchmarks"""
        benchmarks = ReportGenerator.INDUSTRY_BENCHMARKS.get(category, 
                     ReportGenerator.INDUSTRY_BENCHMARKS['operational_excellence'])
        
        if score >= benchmarks['world_class']:
            return 'World Class'
        elif score >= benchmarks['industry_leader']:
            return 'Industry Leader'
        elif score >= benchmarks['competitive']:
            return 'Competitive'
        elif score >= benchmarks['developing']:
            return 'Developing'
        else:
            return 'Emerging'
    
    @staticmethod
    def generate_insights(category: str, score: float, tier: str) -> Dict:
        """Generate McKinsey-style insights for each category"""
        
        insights_map = {
            'operational': {
                'World Class': {
                    'strengths': [
                        'Exceptional operational efficiency with lean manufacturing principles',
                        'Advanced production planning and scheduling systems',
                        'Industry-leading capacity utilization rates'
                    ],
                    'opportunities': [
                        'Share best practices with industry peers',
                        'Explore Industry 4.0 automation opportunities',
                        'Consider vertical integration strategies'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Strong operational processes and workflows',
                        'Good production efficiency metrics',
                        'Effective resource management'
                    ],
                    'opportunities': [
                        'Implement advanced analytics for predictive maintenance',
                        'Optimize production line balancing',
                        'Enhance real-time monitoring capabilities'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Established operational procedures',
                        'Adequate production capabilities',
                        'Basic efficiency tracking in place'
                    ],
                    'opportunities': [
                        'Implement lean manufacturing methodologies',
                        'Invest in production planning software',
                        'Reduce waste and improve OEE (Overall Equipment Effectiveness)'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Basic production systems operational',
                        'Workforce with foundational skills',
                        'Willingness to improve'
                    ],
                    'opportunities': [
                        'Establish standard operating procedures',
                        'Implement basic production tracking systems',
                        'Focus on quality control and waste reduction',
                        'Invest in workforce training programs'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Operational foundation in place',
                        'Potential for significant improvement'
                    ],
                    'opportunities': [
                        'Urgent: Establish basic operational metrics and KPIs',
                        'Implement fundamental quality control processes',
                        'Develop standard work instructions',
                        'Consider consulting support for operational transformation'
                    ]
                }
            },
            'digital': {
                'World Class': {
                    'strengths': [
                        'Fully integrated digital ecosystem across operations',
                        'Advanced data analytics and AI implementation',
                        'Digital-first culture and mindset'
                    ],
                    'opportunities': [
                        'Explore blockchain for supply chain transparency',
                        'Implement AI-driven demand forecasting',
                        'Develop digital twin capabilities'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Strong digital infrastructure',
                        'Good adoption of digital tools',
                        'Data-driven decision making'
                    ],
                    'opportunities': [
                        'Enhance integration between systems',
                        'Implement advanced analytics',
                        'Expand IoT sensor deployment'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Basic digital systems in place',
                        'Some automation implemented',
                        'Digital awareness growing'
                    ],
                    'opportunities': [
                        'Invest in ERP system implementation',
                        'Digitize manual processes',
                        'Implement cloud-based solutions',
                        'Develop digital skills in workforce'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Recognition of digital transformation need',
                        'Some basic software tools in use'
                    ],
                    'opportunities': [
                        'Create digital transformation roadmap',
                        'Start with core systems (ERP, inventory management)',
                        'Build digital literacy across organization',
                        'Pilot IoT solutions in one production line'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Potential for digital leap-frogging',
                        'Clean slate for modern systems'
                    ],
                    'opportunities': [
                        'Critical: Develop comprehensive digital strategy',
                        'Start with basic computerization of records',
                        'Implement simple inventory management software',
                        'Partner with technology providers for guidance'
                    ]
                }
            },
            'supply': {
                'World Class': {
                    'strengths': [
                        'Resilient and agile supply chain network',
                        'Strategic supplier partnerships',
                        'Advanced supply chain visibility'
                    ],
                    'opportunities': [
                        'Implement circular economy principles',
                        'Develop nearshoring strategies',
                        'Enhance supply chain risk management'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Well-managed supplier relationships',
                        'Good inventory management',
                        'Effective logistics operations'
                    ],
                    'opportunities': [
                        'Implement supplier collaboration platforms',
                        'Enhance demand forecasting accuracy',
                        'Optimize inventory levels with AI'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Established supplier base',
                        'Basic supply chain processes',
                        'Adequate inventory control'
                    ],
                    'opportunities': [
                        'Implement vendor management system',
                        'Improve supplier quality metrics',
                        'Reduce lead times through better planning',
                        'Develop alternative sourcing strategies'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Core supplier relationships established',
                        'Basic procurement processes'
                    ],
                    'opportunities': [
                        'Formalize supplier evaluation criteria',
                        'Implement inventory management system',
                        'Develop supply chain visibility',
                        'Establish safety stock policies'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Opportunity to build modern supply chain',
                        'Flexibility in supplier selection'
                    ],
                    'opportunities': [
                        'Urgent: Map current supply chain',
                        'Establish formal procurement processes',
                        'Implement basic inventory tracking',
                        'Develop supplier qualification system'
                    ]
                }
            },
            'sustainability': {
                'World Class': {
                    'strengths': [
                        'Industry-leading sustainability practices',
                        'Comprehensive ESG reporting',
                        'Circular economy implementation'
                    ],
                    'opportunities': [
                        'Achieve carbon neutrality',
                        'Lead industry sustainability initiatives',
                        'Develop sustainable product innovations'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Strong environmental management',
                        'Good compliance with regulations',
                        'Sustainability initiatives underway'
                    ],
                    'opportunities': [
                        'Obtain sustainability certifications (GOTS, OEKO-TEX)',
                        'Implement water recycling systems',
                        'Transition to renewable energy'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Basic environmental compliance',
                        'Awareness of sustainability importance',
                        'Some green initiatives'
                    ],
                    'opportunities': [
                        'Develop comprehensive sustainability strategy',
                        'Measure and reduce carbon footprint',
                        'Implement waste reduction programs',
                        'Source sustainable materials'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Compliance with basic regulations',
                        'Interest in sustainability'
                    ],
                    'opportunities': [
                        'Conduct environmental impact assessment',
                        'Implement energy efficiency measures',
                        'Establish waste management system',
                        'Train staff on sustainability practices'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Potential for sustainable transformation',
                        'Growing market demand for sustainability'
                    ],
                    'opportunities': [
                        'Critical: Ensure environmental compliance',
                        'Start with basic waste segregation',
                        'Measure current resource consumption',
                        'Develop sustainability roadmap'
                    ]
                }
            },
            'quality': {
                'World Class': {
                    'strengths': [
                        'Zero-defect culture and Six Sigma implementation',
                        'Comprehensive quality management system',
                        'International certifications (ISO 9001, etc.)'
                    ],
                    'opportunities': [
                        'Implement AI-powered quality inspection',
                        'Achieve additional premium certifications',
                        'Lead industry quality standards development'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Strong quality control processes',
                        'Good compliance track record',
                        'Effective testing procedures'
                    ],
                    'opportunities': [
                        'Implement statistical process control',
                        'Enhance supplier quality management',
                        'Pursue advanced certifications'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Basic quality systems in place',
                        'Regular inspections conducted',
                        'Quality awareness present'
                    ],
                    'opportunities': [
                        'Implement formal QMS (ISO 9001)',
                        'Enhance in-process quality checks',
                        'Reduce defect rates through root cause analysis',
                        'Invest in testing equipment'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Basic quality checks performed',
                        'Understanding of quality importance'
                    ],
                    'opportunities': [
                        'Establish quality control department',
                        'Implement inspection checklists',
                        'Train quality inspectors',
                        'Document quality procedures'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Opportunity to build quality culture',
                        'Potential for significant improvement'
                    ],
                    'opportunities': [
                        'Urgent: Implement basic quality checks',
                        'Establish acceptance criteria',
                        'Train workforce on quality standards',
                        'Invest in basic testing equipment'
                    ]
                }
            },
            'financial': {
                'World Class': {
                    'strengths': [
                        'Excellent financial performance and margins',
                        'Strong cash flow management',
                        'Strategic financial planning'
                    ],
                    'opportunities': [
                        'Explore strategic acquisitions',
                        'Invest in R&D and innovation',
                        'Expand into premium segments'
                    ]
                },
                'Industry Leader': {
                    'strengths': [
                        'Good profitability and growth',
                        'Effective cost management',
                        'Healthy financial ratios'
                    ],
                    'opportunities': [
                        'Optimize working capital',
                        'Enhance pricing strategies',
                        'Improve financial forecasting'
                    ]
                },
                'Competitive': {
                    'strengths': [
                        'Stable financial position',
                        'Basic financial controls',
                        'Adequate profitability'
                    ],
                    'opportunities': [
                        'Implement activity-based costing',
                        'Improve margin management',
                        'Enhance financial reporting',
                        'Optimize product mix'
                    ]
                },
                'Developing': {
                    'strengths': [
                        'Business generating revenue',
                        'Basic accounting in place'
                    ],
                    'opportunities': [
                        'Implement proper cost accounting',
                        'Improve cash flow management',
                        'Develop financial KPIs',
                        'Enhance pricing discipline'
                    ]
                },
                'Emerging': {
                    'strengths': [
                        'Business operational',
                        'Potential for improvement'
                    ],
                    'opportunities': [
                        'Critical: Establish proper accounting systems',
                        'Implement basic financial controls',
                        'Develop pricing strategy',
                        'Focus on cash flow management'
                    ]
                }
            }
        }
        
        # Map category names to insight keys
        category_map = {
            'operational': 'operational',
            'digital': 'digital',
            'supply': 'supply',
            'sustainability': 'sustainability',
            'quality': 'quality',
            'financial': 'financial'
        }
        
        insight_key = category_map.get(category, 'operational')
        tier_insights = insights_map.get(insight_key, {}).get(tier, {
            'strengths': ['Assessment completed'],
            'opportunities': ['Continue improvement efforts']
        })
        
        return tier_insights
    
    @staticmethod
    def generate_report_data(user_data: Dict, assessment_data: Dict) -> Dict:
        """Generate complete report data structure"""
        
        # Calculate category scores
        category_scores = ReportGenerator.calculate_category_scores(assessment_data['answers'])
        
        # Calculate overall score
        overall_score = sum(category_scores.values()) / len(category_scores) if category_scores else 0
        overall_tier = ReportGenerator.get_performance_tier(overall_score, 'operational_excellence')
        
        # Generate category-wise insights
        category_insights = {}
        for category, score in category_scores.items():
            tier = ReportGenerator.get_performance_tier(score, category)
            insights = ReportGenerator.generate_insights(category, score, tier)
            category_insights[category] = {
                'score': score,
                'tier': tier,
                'strengths': insights['strengths'],
                'opportunities': insights['opportunities']
            }
        
        # Generate executive summary
        executive_summary = ReportGenerator.generate_executive_summary(
            overall_score, overall_tier, category_scores
        )
        
        # Generate recommendations
        recommendations = ReportGenerator.generate_recommendations(category_insights)
        
        return {
            'company_info': {
                'name': user_data.get('business_name', 'N/A'),
                'contact_person': user_data.get('full_name', 'N/A'),
                'designation': user_data.get('designation', 'N/A'),
                'email': user_data.get('email', 'N/A'),
                'mobile': user_data.get('mobile', 'N/A')
            },
            'assessment_info': {
                'date': datetime.now().strftime('%B %d, %Y'),
                'assessment_id': assessment_data.get('id', 'N/A'),
                'overall_score': round(overall_score, 1),
                'overall_tier': overall_tier
            },
            'executive_summary': executive_summary,
            'category_scores': category_scores,
            'category_insights': category_insights,
            'recommendations': recommendations,
            'next_steps': ReportGenerator.generate_next_steps(overall_tier)
        }
    
    @staticmethod
    def generate_executive_summary(overall_score: float, tier: str, category_scores: Dict) -> str:
        """Generate executive summary based on assessment results"""
        
        # Find strongest and weakest categories
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        strongest = sorted_categories[0] if sorted_categories else ('N/A', 0)
        weakest = sorted_categories[-1] if sorted_categories else ('N/A', 0)
        
        summary = f"""
Your organization has achieved an overall business intelligence maturity score of {overall_score:.1f}%, 
placing you in the "{tier}" category among Tirupur garment manufacturers and exporters.

This assessment evaluated your organization across six critical dimensions: Operational Excellence, 
Digital Transformation, Supply Chain Management, Sustainability & Compliance, Quality Management, 
and Financial Performance.

Key Findings:
• Your strongest area is {strongest[0].replace('_', ' ').title()} with a score of {strongest[1]:.1f}%
• Your greatest opportunity for improvement is in {weakest[0].replace('_', ' ').title()} ({weakest[1]:.1f}%)
• You are performing {"above" if overall_score > 65 else "at" if overall_score > 50 else "below"} the industry average

The detailed analysis below provides specific insights and actionable recommendations to enhance 
your competitive position in the global apparel market.
        """.strip()
        
        return summary
    
    @staticmethod
    def generate_recommendations(category_insights: Dict) -> List[Dict]:
        """Generate prioritized recommendations"""
        
        recommendations = []
        
        # Sort categories by score (lowest first - highest priority)
        sorted_categories = sorted(category_insights.items(), key=lambda x: x[1]['score'])
        
        priority_levels = ['Critical', 'High', 'Medium', 'Medium', 'Low', 'Low']
        
        for idx, (category, insights) in enumerate(sorted_categories):
            priority = priority_levels[min(idx, len(priority_levels)-1)]
            
            # Take top 2 opportunities
            for opportunity in insights['opportunities'][:2]:
                recommendations.append({
                    'category': category.replace('_', ' ').title(),
                    'priority': priority,
                    'recommendation': opportunity,
                    'expected_impact': 'High' if priority in ['Critical', 'High'] else 'Medium'
                })
        
        return recommendations[:10]  # Return top 10 recommendations
    
    @staticmethod
    def generate_next_steps(tier: str) -> List[str]:
        """Generate next steps based on performance tier"""
        
        next_steps_map = {
            'World Class': [
                'Schedule a strategic consultation to discuss market expansion opportunities',
                'Explore partnership opportunities with Navvi for industry leadership initiatives',
                'Consider sharing best practices through case studies and industry events',
                'Evaluate opportunities for digital innovation and Industry 4.0 implementation'
            ],
            'Industry Leader': [
                'Schedule a consultation to develop a roadmap to World Class status',
                'Identify specific areas for operational excellence enhancement',
                'Explore advanced technology adoption opportunities',
                'Develop strategies to maintain competitive advantage'
            ],
            'Competitive': [
                'Schedule a comprehensive business review with our consulting team',
                'Prioritize implementation of top 3 recommendations',
                'Develop a 12-month improvement roadmap',
                'Consider targeted training programs for your team'
            ],
            'Developing': [
                'Schedule an urgent consultation to address critical gaps',
                'Develop a comprehensive transformation roadmap',
                'Identify quick wins for immediate implementation',
                'Explore consulting support for capability building'
            ],
            'Emerging': [
                'Schedule an immediate consultation with our transformation experts',
                'Conduct a detailed operational assessment',
                'Develop a phased improvement plan with clear milestones',
                'Consider comprehensive consulting engagement for business transformation'
            ]
        }
        
        return next_steps_map.get(tier, next_steps_map['Competitive'])

