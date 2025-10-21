import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFData {
  idea: {
    text: string;
    category: string;
    created_at?: string;
    name?: string;
    type?: string;
    country?: string;
    founders?: string | string[];
  };
  responses?: Array<{
    question: string;
    answer: string;
  }>;
  bmcAnswers?: {
    customer_segments?: string;
    value_propositions?: string;
    channels?: string;
    customer_relationships?: string;
    revenue_streams?: string;
    key_resources?: string;
    key_activities?: string;
    key_partners?: string;
    cost_structure?: string;
  };
  pathContent?: {
    [key: string]: string[];
  };
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  user?: {
    name: string;
    email: string;
  };
  analysis?: {
    idea_type?: string;
    field?: string;
    competitors?: string[];
  };
}

export const generatePDF = async (data: PDFData): Promise<Blob> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, pageWidth - 40);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 10;
  };

  // Header
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Found Your Path', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(14);
  pdf.text('Business Blueprint with BMC', pageWidth / 2, 28, { align: 'center' });

  // Reset text color
  pdf.setTextColor(0, 0, 0);
  yPosition = 50;

  // Project Name & Type
  addText('PROJECT OVERVIEW', 18, true);
  yPosition += 5;
  
  if (data.idea.name) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Project Name: ${data.idea.name}`, 20, yPosition);
    yPosition += 10;
  } else {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Description:', 20, yPosition);
    yPosition += 8;
    pdf.setFont('helvetica', 'normal');
    const ideaLines = pdf.splitTextToSize(data.idea.text, pageWidth - 40);
    ideaLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  // Project Type
  const projectType = data.analysis?.idea_type || data.idea.type || data.idea.category;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Project Type: ', 20, yPosition);
  pdf.setFont('helvetica', 'normal');
  pdf.text(projectType, 55, yPosition);
  yPosition += 8;

  // Field/Industry
  if (data.analysis?.field) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Industry/Field: ', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.analysis.field, 55, yPosition);
    yPosition += 8;
  }

  // Country
  if (data.idea.country) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Country: ', 20, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.idea.country, 55, yPosition);
    yPosition += 8;
  }

  // Founders
  if (data.idea.founders) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Founding Team: ', 20, yPosition);
    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    
    // Handle both string and array types
    const founders = Array.isArray(data.idea.founders) 
      ? data.idea.founders 
      : [data.idea.founders];
    
    if (founders.length > 0 && founders[0]) {
      founders.forEach((founder, index) => {
        pdf.text(`  ${index + 1}. ${founder}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }
  }

  // Generation Info
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  const userName = data.user?.name || 'User';
  const generatedDate = data.idea.created_at ? new Date(data.idea.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  pdf.text(`Generated for: ${userName} | Date: ${generatedDate}`, 20, yPosition);
  pdf.setTextColor(0, 0, 0);
  yPosition += 15;

  // Business Model Canvas section if available
  if (data.bmcAnswers) {
    // Add new page for BMC
    if (yPosition > 100) {
      pdf.addPage();
      yPosition = 20;
    }

    // BMC Title
    pdf.setFillColor(41, 128, 185);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BUSINESS MODEL CANVAS', pageWidth / 2, yPosition + 3, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    yPosition += 20;

    // Draw BMC Table with Data
    const tableStartY = yPosition;
    const cellWidth = (pageWidth - 40) / 5;
    const cellHeight = 35;
    const contentFontSize = 7;
    const titleFontSize = 8;

    // Helper function to add text in cell with word wrap
    const addCellText = (text: string, x: number, y: number, width: number, maxLines: number = 4) => {
      pdf.setFontSize(contentFontSize);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(text || 'Not specified', width - 4);
      const linesToShow = lines.slice(0, maxLines);
      linesToShow.forEach((line: string, index: number) => {
        if (y + 10 + (index * 3) < y + cellHeight - 2) {
          pdf.text(line, x, y + 10 + (index * 3));
        }
      });
    };

    // Row 1
    let currentY = yPosition;
    
    // Key Partners
    pdf.rect(20, currentY, cellWidth, cellHeight);
    pdf.setFontSize(titleFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Partners', 22, currentY + 5);
    addCellText(data.bmcAnswers?.key_partners || '', 22, currentY, cellWidth);
    
    // Key Activities  
    pdf.rect(20 + cellWidth, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Activities', 22 + cellWidth, currentY + 5);
    addCellText(data.bmcAnswers?.key_activities || '', 22 + cellWidth, currentY, cellWidth);
    
    // Value Proposition
    pdf.rect(20 + cellWidth * 2, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Value Propositions', 22 + cellWidth * 2, currentY + 5);
    addCellText(data.bmcAnswers?.value_propositions || '', 22 + cellWidth * 2, currentY, cellWidth);
    
    // Customer Relationships
    pdf.rect(20 + cellWidth * 3, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer', 22 + cellWidth * 3, currentY + 5);
    pdf.text('Relationships', 22 + cellWidth * 3, currentY + 8);
    addCellText(data.bmcAnswers?.customer_relationships || '', 22 + cellWidth * 3, currentY, cellWidth);
    
    // Customer Segments
    pdf.rect(20 + cellWidth * 4, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer', 22 + cellWidth * 4, currentY + 5);
    pdf.text('Segments', 22 + cellWidth * 4, currentY + 8);
    addCellText(data.bmcAnswers?.customer_segments || '', 22 + cellWidth * 4, currentY, cellWidth);

    // Row 2
    currentY += cellHeight;
    
    // Key Resources
    pdf.rect(20, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Resources', 22, currentY + 5);
    addCellText(data.bmcAnswers?.key_resources || '', 22, currentY, cellWidth);
    
    // Empty cell under Key Activities
    pdf.rect(20 + cellWidth, currentY, cellWidth, cellHeight);
    
    // Channels
    pdf.rect(20 + cellWidth * 2, currentY, cellWidth, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Channels', 22 + cellWidth * 2, currentY + 5);
    addCellText(data.bmcAnswers?.channels || '', 22 + cellWidth * 2, currentY, cellWidth);
    
    // Empty cells (spans 2 columns)
    pdf.rect(20 + cellWidth * 3, currentY, cellWidth * 2, cellHeight);

    // Row 3
    currentY += cellHeight;
    
    // Cost Structure
    pdf.rect(20, currentY, cellWidth * 2.5, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Cost Structure', 22, currentY + 5);
    addCellText(data.bmcAnswers?.cost_structure || '', 22, currentY, cellWidth * 2.5);
    
    // Revenue Streams
    pdf.rect(20 + cellWidth * 2.5, currentY, cellWidth * 2.5, cellHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Revenue Streams', 22 + cellWidth * 2.5, currentY + 5);
    addCellText(data.bmcAnswers?.revenue_streams || '', 22 + cellWidth * 2.5, currentY, cellWidth * 2.5);

    yPosition = currentY + cellHeight + 15;

    // Detailed BMC Sections
    pdf.addPage();
    yPosition = 20;

    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 10, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BUSINESS MODEL CANVAS - DETAILED ANALYSIS', pageWidth / 2, yPosition + 2, { align: 'center' });
    yPosition += 15;

    // Get project context
    const projectType = data.analysis?.idea_type || data.idea.type || 'General';
    const country = data.idea.country || 'your country';
    
    // Generate context-aware BMC sections
    const getBMCAnalysis = (key: string, answer: string) => {
      const analyses: Record<string, string> = {};
      
      // Value Propositions
      if (key === 'value_propositions') {
        if (projectType.includes('Agric')) {
          analyses['analysis'] = `For agricultural projects in ${country}, focus on: sustainable practices, local food security, organic certification opportunities, and export potential. Consider partnerships with agricultural cooperatives and government agricultural programs.`;
        } else if (projectType.includes('SaaS') || projectType.includes('Software')) {
          analyses['analysis'] = `For SaaS products, emphasize: scalability, recurring revenue potential, cloud infrastructure, and competitive differentiation. Consider freemium models and strategic partnerships with tech platforms.`;
        } else if (projectType.includes('Food')) {
          analyses['analysis'] = `For food businesses in ${country}, highlight: quality ingredients, hygiene standards, delivery options, and local taste preferences. Consider food safety regulations and halal certification if applicable.`;
        } else {
          analyses['analysis'] = `Focus on what makes your solution unique in ${country}'s market. Consider local regulations, cultural preferences, and competitive advantages.`;
        }
      }
      
      // Customer Segments
      else if (key === 'customer_segments') {
        analyses['analysis'] = `In ${country}, consider: purchasing power, demographic trends, urban vs rural distribution, and digital adoption rates. Tailor your offerings to local economic conditions and cultural preferences.`;
      }
      
      // Channels
      else if (key === 'channels') {
        analyses['analysis'] = `Popular channels in ${country} may include: social media (Facebook, Instagram, TikTok), WhatsApp Business, local e-commerce platforms, and traditional retail. Consider mobile-first strategies as smartphone penetration increases.`;
      }
      
      // Key Partners
      else if (key === 'key_partners') {
        if (country.toLowerCase().includes('egypt') || country.toLowerCase().includes('مصر')) {
          analyses['analysis'] = `In Egypt, consider: local suppliers for cost efficiency, partnerships with industrial zones (10th of Ramadan, 6th of October), government support programs (ITIDA, SFD), and logistics providers like Aramex or Bosta.`;
        } else if (country.toLowerCase().includes('uae') || country.toLowerCase().includes('emirates') || country.toLowerCase().includes('الإمارات')) {
          analyses['analysis'] = `In UAE, leverage: free zones benefits, Dubai SME support, partnerships with innovation hubs (Dubai Future Foundation), and regional logistics infrastructure.`;
        } else if (country.toLowerCase().includes('saudi') || country.toLowerCase().includes('السعودية')) {
          analyses['analysis'] = `In Saudi Arabia, explore: Vision 2030 initiatives, Monsha'at SME Authority support, partnerships with accelerators (Badir, KAUST), and local manufacturing incentives.`;
        } else {
          analyses['analysis'] = `Identify strategic partnerships with local suppliers, distributors, technology providers, and industry associations in ${country}. Consider government support programs for SMEs.`;
        }
      }
      
      // Cost Structure
      else if (key === 'cost_structure') {
        analyses['analysis'] = `Key cost considerations in ${country}: labor costs, rent/facilities, raw materials, marketing, licenses/permits, and utilities. Plan for seasonal variations and currency fluctuations. Consider tax incentives for startups.`;
      }
      
      // Revenue Streams
      else if (key === 'revenue_streams') {
        if (projectType.includes('SaaS')) {
          analyses['analysis'] = `SaaS revenue models: monthly/annual subscriptions, tiered pricing, usage-based fees, enterprise licenses. Consider local payment methods (cash on delivery, Fawry, mada) and regional pricing strategies.`;
        } else if (projectType.includes('E-commerce')) {
          analyses['analysis'] = `E-commerce revenue: direct sales, marketplace commissions, premium memberships, affiliate marketing. Accept popular payment methods in ${country} including mobile wallets and cash on delivery.`;
        } else {
          analyses['analysis'] = `Diversify revenue streams: product sales, service fees, licensing, partnerships. Consider payment preferences in ${country} and offer flexible payment terms to increase adoption.`;
        }
      }
      
      return analyses['analysis'] || `Based on your answer and ${country}'s market conditions, ensure this aligns with local regulations, customer preferences, and competitive landscape.`;
    };

    const bmcSections = [
      { 
        key: 'value_propositions', 
        title: '1. Value Propositions',
        explanation: 'What unique value does your project offer to customers? What problems do you solve?'
      },
      { 
        key: 'customer_segments', 
        title: '2. Customer Segments',
        explanation: 'Who are your target customers? What are their characteristics and needs?'
      },
      { 
        key: 'customer_relationships', 
        title: '3. Customer Relationships',
        explanation: 'How will you build and maintain relationships with your customers?'
      },
      { 
        key: 'channels', 
        title: '4. Channels',
        explanation: 'Through which channels will you reach and deliver value to your customers?'
      },
      { 
        key: 'key_partners', 
        title: '5. Key Partnerships',
        explanation: 'Who are your key partners and suppliers? What resources do you acquire from them?'
      },
      { 
        key: 'key_activities', 
        title: '6. Key Activities',
        explanation: 'What are the most important activities required to make your business model work?'
      },
      { 
        key: 'key_resources', 
        title: '7. Key Resources',
        explanation: 'What key resources does your value proposition require?'
      },
      { 
        key: 'cost_structure', 
        title: '8. Cost Structure',
        explanation: 'What are the most important costs in your business model?'
      },
      { 
        key: 'revenue_streams', 
        title: '9. Revenue Streams',
        explanation: 'How will your business generate revenue? What are your pricing strategies?'
      }
    ];
    
    bmcSections.forEach((section, index) => {
      const answer = data.bmcAnswers![section.key as keyof typeof data.bmcAnswers];
      if (answer) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        // Section Header
        pdf.setFillColor(220, 230, 240);
        pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.title, 22, yPosition + 5);
        yPosition += 12;

        // Explanation
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(80, 80, 80);
        const explanationLines = pdf.splitTextToSize(section.explanation, pageWidth - 44);
        explanationLines.forEach((line: string) => {
          pdf.text(line, 22, yPosition);
          yPosition += 4;
        });
        yPosition += 2;

        // Answer
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Your Answer:', 22, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const answerLines = pdf.splitTextToSize(answer, pageWidth - 44);
        answerLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 22, yPosition);
          yPosition += 5;
        });
        yPosition += 5;

        // Context-aware analysis
        const analysis = getBMCAnalysis(section.key, answer);
        pdf.setFillColor(250, 250, 220);
        pdf.rect(20, yPosition, pageWidth - 40, 3, 'F');
        yPosition += 5;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(120, 80, 20);
        pdf.text('💡 Strategic Insights:', 22, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const analysisLines = pdf.splitTextToSize(analysis, pageWidth - 44);
        analysisLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 22, yPosition);
          yPosition += 4;
        });
        pdf.setTextColor(0, 0, 0);
        yPosition += 10;
      }
    });
    
    yPosition += 10;
  }

  // Refined Responses
  if (data.responses && data.responses.length > 0) {
    addText('Refined Information', 14, true);
    data.responses.forEach((response, index) => {
      addText(`${index + 1}. ${response.question}`, 12, true);
      addText(`Answer: ${response.answer}`);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Business Plan
  if (data.pathContent && Object.keys(data.pathContent).length > 0) {
    addText('Your Business Plan', 14, true);
    Object.entries(data.pathContent).forEach(([category, steps]) => {
      addText(category, 12, true);
      steps.forEach((step, index) => {
        addText(`  ${index + 1}. ${step}`);
      });
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Resources
  if (data.resources && data.resources.length > 0) {
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }
    addText('Recommended Resources', 14, true);
    data.resources.forEach((resource, index) => {
      addText(`${index + 1}. ${resource.title}`, 12, true);
      addText(`   Type: ${resource.type}`);
      if (resource.url) {
        addText(`   Link: ${resource.url}`);
      }
      yPosition += 5;
    });
  }

  // Recommendations & Tips Section
  pdf.addPage();
  yPosition = 20;

  pdf.setFillColor(41, 128, 185);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RECOMMENDATIONS & STRATEGIC ADVICE', pageWidth / 2, yPosition + 3, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  yPosition += 20;

  const currentProjectType = data.analysis?.idea_type || data.idea.type || data.idea.category;
  const country = data.idea.country || 'your country';

  // General recommendations based on project type
  let recommendations: string[] = [];
  
  if (currentProjectType.toLowerCase().includes('saas') || currentProjectType.toLowerCase().includes('software')) {
    recommendations = [
      'Start with an MVP (Minimum Viable Product) to validate your idea with minimal investment',
      'Focus on user acquisition and retention metrics from day one',
      'Consider freemium or trial models to lower customer acquisition barriers',
      'Build a strong technical team with expertise in cloud infrastructure and security',
      'Prioritize scalability in your architecture from the beginning'
    ];
  } else if (currentProjectType.toLowerCase().includes('ecommerce') || currentProjectType.toLowerCase().includes('retail')) {
    recommendations = [
      'Invest in high-quality product photography and detailed descriptions',
      'Optimize your website for mobile devices - over 60% of ecommerce traffic is mobile',
      'Implement a robust inventory management system to avoid stockouts',
      'Build trust through customer reviews, secure payment gateways, and clear return policies',
      'Leverage social media marketing and influencer partnerships for brand awareness'
    ];
  } else if (currentProjectType.toLowerCase().includes('crypto') || currentProjectType.toLowerCase().includes('fintech')) {
    recommendations = [
      'Prioritize regulatory compliance and obtain necessary licenses in your operating regions',
      'Implement robust security measures including multi-factor authentication and encryption',
      'Build transparency into your platform to gain user trust',
      'Partner with established financial institutions where possible to add credibility',
      'Stay updated with rapidly changing regulations in the crypto/fintech space'
    ];
  } else if (currentProjectType.toLowerCase().includes('agricultural') || currentProjectType.toLowerCase().includes('زراعي')) {
    recommendations = [
      'Conduct thorough soil and climate analysis for your target region',
      'Explore sustainable and organic farming practices to meet market demand',
      'Build relationships with local agricultural cooperatives and distributors',
      'Consider vertical integration to control quality and reduce costs',
      'Investigate government subsidies and agricultural development programs'
    ];
  } else if (currentProjectType.toLowerCase().includes('security') || currentProjectType.toLowerCase().includes('أمني')) {
    recommendations = [
      'Ensure all staff undergo thorough background checks and security training',
      'Obtain necessary security licenses and certifications for your region',
      'Invest in state-of-the-art security equipment and monitoring systems',
      'Develop comprehensive emergency response protocols',
      'Build strong relationships with local law enforcement agencies'
    ];
  } else if (currentProjectType.toLowerCase().includes('environment') || currentProjectType.toLowerCase().includes('بيئي')) {
    recommendations = [
      'Align your project with UN Sustainable Development Goals (SDGs)',
      'Seek certifications like ISO 14001 for environmental management',
      'Explore green financing options and environmental grants',
      'Build partnerships with environmental NGOs and government agencies',
      'Measure and report your environmental impact regularly'
    ];
  } else if (currentProjectType.toLowerCase().includes('food') || currentProjectType.toLowerCase().includes('مطعم') || currentProjectType.toLowerCase().includes('restaurant')) {
    recommendations = [
      `In ${country}, ensure compliance with food safety regulations and health department requirements`,
      'Focus on consistent quality, hygiene, and customer service to build reputation',
      'Develop a strong brand identity that resonates with your target demographic',
      'Leverage food delivery platforms and social media for marketing',
      'Create unique menu items that differentiate you from competitors'
    ];
  } else if (currentProjectType.toLowerCase().includes('health') || currentProjectType.toLowerCase().includes('medical') || currentProjectType.toLowerCase().includes('صح')) {
    recommendations = [
      'Obtain all necessary medical licenses and certifications',
      'Prioritize patient privacy and data security (HIPAA compliance if applicable)',
      'Build a qualified team of healthcare professionals',
      'Invest in modern medical equipment and technology',
      'Develop strong relationships with insurance providers and hospitals'
    ];
  } else if (currentProjectType.toLowerCase().includes('education') || currentProjectType.toLowerCase().includes('edtech') || currentProjectType.toLowerCase().includes('تعليم')) {
    recommendations = [
      'Design engaging, interactive learning experiences that cater to different learning styles',
      'Obtain necessary educational accreditations and certifications',
      'Leverage technology for scalability (LMS, video platforms, mobile apps)',
      'Build a strong instructor/content creator network',
      'Focus on measurable learning outcomes and student success metrics'
    ];
  } else if (currentProjectType.toLowerCase().includes('real estate') || currentProjectType.toLowerCase().includes('عقار') || currentProjectType.toLowerCase().includes('property')) {
    recommendations = [
      `Understand ${country}'s real estate laws, property rights, and foreign ownership restrictions`,
      'Build strong relationships with developers, brokers, and legal advisors',
      'Leverage technology for property listings, virtual tours, and transaction management',
      'Focus on high-growth areas with strong infrastructure development',
      'Diversify your portfolio across different property types and locations'
    ];
  } else if (currentProjectType.toLowerCase().includes('mobile') || currentProjectType.toLowerCase().includes('app') || currentProjectType.toLowerCase().includes('تطبيق')) {
    recommendations = [
      'Design for both iOS and Android from the start, or choose one based on market share',
      'Focus on exceptional user experience (UX) and intuitive interface design',
      'Implement robust analytics to track user behavior and optimize features',
      'Plan your monetization strategy early (ads, in-app purchases, subscriptions)',
      'Invest in app store optimization (ASO) to improve discoverability'
    ];
  } else {
    recommendations = [
      'Conduct thorough market research to validate demand for your product/service',
      'Start with a focused niche market before expanding to broader segments',
      'Build a strong team with complementary skills and shared vision',
      'Create a detailed financial projection and secure adequate funding',
      'Develop a clear go-to-market strategy with measurable milestones'
    ];
  }

  // Add recommendations
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Recommendations for Your Project:', 20, yPosition);
  yPosition += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  recommendations.forEach((rec, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}.`, 22, yPosition);
    pdf.setFont('helvetica', 'normal');
    
    const recLines = pdf.splitTextToSize(rec, pageWidth - 50);
    recLines.forEach((line: string, lineIndex: number) => {
      pdf.text(line, 30, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  });

  yPosition += 10;

  // Country-specific advice
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Considerations for Operating in ${country}:`, 20, yPosition);
  yPosition += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const countryTips = [
    'Research local business registration requirements and tax obligations',
    'Understand cultural nuances and adapt your marketing accordingly',
    'Build a network of local advisors, mentors, and business contacts',
    'Explore local startup incubators, accelerators, and funding opportunities',
    'Stay informed about government policies and regulations affecting your industry'
  ];

  countryTips.forEach((tip, index) => {
    if (yPosition > pageHeight - 25) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}.`, 22, yPosition);
    pdf.setFont('helvetica', 'normal');
    
    const tipLines = pdf.splitTextToSize(tip, pageWidth - 50);
    tipLines.forEach((line: string) => {
      pdf.text(line, 30, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  });

  yPosition += 15;

  // Next Steps
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMMEDIATE NEXT STEPS', pageWidth / 2, yPosition + 2, { align: 'center' });
  yPosition += 15;

  const nextSteps = [
    'Validate your Business Model Canvas with potential customers and stakeholders',
    'Develop a detailed 12-month action plan based on your roadmap',
    'Identify and connect with key partners and advisors',
    'Create financial projections for at least 3 years',
    'Begin building your MVP or pilot program',
    'Set up legal structure and necessary registrations',
    'Develop your brand identity and online presence'
  ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  nextSteps.forEach((step, index) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const checkbox = '☐';
    pdf.text(checkbox, 22, yPosition);
    const stepLines = pdf.splitTextToSize(step, pageWidth - 50);
    stepLines.forEach((line: string) => {
      pdf.text(line, 30, yPosition);
      yPosition += 5;
    });
    yPosition += 2;
  });

  // Closing message
  yPosition += 10;
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFillColor(41, 128, 185);
  pdf.rect(20, yPosition, pageWidth - 40, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Remember: Success is a journey, not a destination.', pageWidth / 2, yPosition + 10, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text('Stay focused, adapt to changes, and keep learning from your experiences.', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.setTextColor(0, 0, 0);

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 50, pageHeight - 10);
    pdf.text('Generated by Found Your Path', 20, pageHeight - 10);
  }

  return pdf.output('blob');
};

export const generatePDFFromHTML = async (elementId: string): Promise<Blob> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output('blob');
};
