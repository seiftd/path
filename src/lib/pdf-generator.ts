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
  if (data.idea.founders && data.idea.founders.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Founding Team: ', 20, yPosition);
    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    data.idea.founders.forEach((founder, index) => {
      pdf.text(`  ${index + 1}. ${founder}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 3;
  }

  // Generation Info
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated for: ${data.user.name} | Date: ${new Date(data.idea.created_at).toLocaleDateString()}`, 20, yPosition);
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

    // Draw BMC Table
    const tableStartY = yPosition;
    const cellWidth = (pageWidth - 40) / 5;
    const cellHeight = 35;

    // Row 1
    // Key Partners
    pdf.rect(20, yPosition, cellWidth, cellHeight);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('5. Key Partnerships', 22, yPosition + 5);
    
    // Key Activities  
    pdf.rect(20 + cellWidth, yPosition, cellWidth, cellHeight);
    pdf.text('6. Key Activities', 22 + cellWidth, yPosition + 5);
    
    // Value Proposition
    pdf.rect(20 + cellWidth * 2, yPosition, cellWidth, cellHeight);
    pdf.text('1. Value Proposition', 22 + cellWidth * 2, yPosition + 5);
    
    // Customer Relationships
    pdf.rect(20 + cellWidth * 3, yPosition, cellWidth, cellHeight);
    pdf.text('3. Customer', 22 + cellWidth * 3, yPosition + 5);
    pdf.text('   Relationships', 22 + cellWidth * 3, yPosition + 8);
    
    // Customer Segments
    pdf.rect(20 + cellWidth * 4, yPosition, cellWidth, cellHeight);
    pdf.text('2. Customer', 22 + cellWidth * 4, yPosition + 5);
    pdf.text('   Segments', 22 + cellWidth * 4, yPosition + 8);

    // Row 2
    yPosition += cellHeight;
    
    // Key Resources (spans Key Partners & Key Activities columns)
    pdf.rect(20, yPosition, cellWidth, cellHeight);
    pdf.text('7. Key Resources', 22, yPosition + 5);
    
    // Empty cell
    pdf.rect(20 + cellWidth, yPosition, cellWidth, cellHeight);
    
    // Channels (spans Customer Relationships & Customer Segments)
    pdf.rect(20 + cellWidth * 2, yPosition, cellWidth, cellHeight);
    pdf.text('4. Distribution', 22 + cellWidth * 2, yPosition + 5);
    pdf.text('   Channels', 22 + cellWidth * 2, yPosition + 8);
    
    pdf.rect(20 + cellWidth * 3, yPosition, cellWidth * 2, cellHeight);

    // Row 3
    yPosition += cellHeight;
    
    // Cost Structure
    pdf.rect(20, yPosition, cellWidth * 2.5, cellHeight);
    pdf.text('8. Cost Structure', 22, yPosition + 5);
    
    // Revenue Streams
    pdf.rect(20 + cellWidth * 2.5, yPosition, cellWidth * 2.5, cellHeight);
    pdf.text('9. Revenue Streams', 22 + cellWidth * 2.5, yPosition + 5);

    yPosition += cellHeight + 15;

    // Detailed BMC Sections
    pdf.addPage();
    yPosition = 20;

    pdf.setFillColor(240, 240, 240);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 10, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BUSINESS MODEL CANVAS - DETAILED ANALYSIS', pageWidth / 2, yPosition + 2, { align: 'center' });
    yPosition += 15;

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
        const answerLines = pdf.splitTextToSize(answer, pageWidth - 44);
        answerLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 22, yPosition);
          yPosition += 5;
        });
        yPosition += 8;
      }
    });
    
    yPosition += 10;
  }

  // Refined Responses
  if (data.responses.length > 0) {
    addText('Refined Information', 14, true);
    data.responses.forEach((response, index) => {
      addText(`${index + 1}. ${response.question}`, 12, true);
      addText(`Answer: ${response.answer}`);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Business Plan
  addText('Your Business Plan', 14, true);
  Object.entries(data.pathContent).forEach(([category, steps]) => {
    addText(category, 12, true);
    steps.forEach((step, index) => {
      addText(`  ${index + 1}. ${step}`);
    });
    yPosition += 5;
  });
  yPosition += 10;

  // Resources
  if (data.resources.length > 0) {
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
