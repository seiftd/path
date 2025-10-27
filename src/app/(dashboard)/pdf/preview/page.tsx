'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PDFData {
  user: { name: string };
  idea: { text: string; category?: string };
  responses: Array<{ question: string; answer: string }>;
  pathContent: Record<string, string[]>;
  resources: Array<{ title: string; type: string }>;
  [key: string]: unknown;
}

export default function PDFPreview() {
  const { t } = useTranslation();
  const router = useRouter();
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    loadPDFData();
  }, []);

  const loadPDFData = () => {
    // Load data from localStorage
    const ideaData = JSON.parse(localStorage.getItem('currentIdea') || '{}');
    const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
    const completedNodes = JSON.parse(localStorage.getItem('completedNodes') || '[]');

    const mockPDFData = {
      idea: {
        text: ideaData.text || 'Sample business idea',
        category: ideaData.analysis?.category || 'Technology',
        created_at: new Date().toISOString()
      },
      responses: [
        { question: 'Target Country', answer: 'United States' },
        { question: 'Budget Range', answer: '$10,000-50,000' },
        { question: 'Target Audience', answer: 'Small business owners' },
        { question: 'Unique Value', answer: 'AI-powered automation' }
      ],
      pathContent: {
        Foundation: [
          'Set up legal business structure',
          'Register business name and obtain licenses',
          'Set up business bank account',
          'Create initial business plan'
        ],
        'Product Development': [
          'Define MVP requirements',
          'Develop core features',
          'Create user interface',
          'Test with beta users'
        ],
        'Marketing & Sales': [
          'Identify target market segments',
          'Create marketing strategy',
          'Build brand identity',
          'Launch marketing campaigns'
        ],
        Operations: [
          'Set up operational processes',
          'Hire and train team',
          'Implement quality control',
          'Establish customer service'
        ],
        Finance: [
          'Create financial projections',
          'Set up accounting system',
          'Secure initial funding',
          'Monitor cash flow'
        ]
      },
      resources: [
        { title: 'Business Planning Course', url: '#', type: 'course' },
        { title: 'Marketing Strategy Guide', url: '#', type: 'article' },
        { title: 'Financial Planning Book', url: '#', type: 'book' },
        { title: 'Project Management Tool', url: '#', type: 'tool' }
      ],
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    };

    setPdfData(mockPDFData);
  };

  const handleDownload = () => {
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    try {
      // Get current idea ID from localStorage or generate one
      const ideaData = JSON.parse(localStorage.getItem('currentIdea') || '{}');
      const ideaId = ideaData.id || `idea_${Date.now()}`;
      
      // Create payment with Dodo Payments
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: ideaId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.status}`);
      }

      const paymentData = await response.json();
      
      if (paymentData.payment_url) {
        // Redirect to Dodo Payments checkout
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again or contact support.');
    } finally {
      setPaymentProcessing(false);
      setShowPayment(false);
    }
  };

  const generatePDF = async () => {
    if (!pdfData) return null;
    
    // In real app, this would call the PDF generation API
    const mockPDFContent = `
      Business Blueprint Report
      Generated for: ${pdfData.user.name}
      Date: ${new Date().toLocaleDateString()}
      
      Original Idea:
      ${pdfData.idea.text}
      
      Business Plan:
      ${Object.entries(pdfData.pathContent).map(([category, steps]) => 
        `${category}:\n${steps.map(step => `- ${step}`).join('\n')}`
      ).join('\n\n')}
    `;
    
    return new Blob([mockPDFContent], { type: 'application/pdf' });
  };

  if (!pdfData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/path/generate" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Path
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('pdf.title')}
          </h1>
          <p className="text-gray-600">
            Review your complete business blueprint before downloading.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* PDF Preview */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Blueprint</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Generated for: {pdfData.user.name}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>•</span>
                  <Badge variant="secondary">{pdfData.idea.category}</Badge>
                </div>
              </div>

              {/* Original Idea */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Original Idea</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{pdfData.idea.text}</p>
                </div>
              </div>

              {/* Refined Information */}
              {pdfData.responses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Refined Information</h3>
                  <div className="space-y-3">
                    {pdfData.responses.map((response, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{response.question}</span>
                        <span className="text-gray-600">{response.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Plan */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Business Plan</h3>
                <div className="space-y-6">
                  {Object.entries(pdfData.pathContent).map(([category, steps]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <ul className="space-y-1">
                        {steps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {pdfData.resources.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Resources</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pdfData.resources.map((resource, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{resource.title}</div>
                        <div className="text-sm text-gray-600 capitalize">{resource.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Download Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Your Blueprint</h3>
                <p className="text-gray-600 text-sm">
                  Get your complete business blueprint as a professional PDF
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">PDF Report</span>
                  <span className="font-semibold text-gray-900">{t('pdf.price')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Pages</span>
                  <span className="text-gray-600">~8 pages</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Format</span>
                  <span className="text-gray-600">Professional PDF</span>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment • Instant download • 30-day money-back guarantee
              </p>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Purchase</h3>
                <p className="text-gray-600">Get your business blueprint for just $2</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Business Blueprint PDF</span>
                  <span className="font-semibold">$2.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>$2.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay $2.00
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="w-full"
                  disabled={paymentProcessing}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
