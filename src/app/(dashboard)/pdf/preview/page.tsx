'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, CheckCircle, BookOpen, Video, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getResourceRecommendations, getYouTubeChannelRecommendations } from '@/lib/resource-recommendations';
import { generatePDF as generatePDFDocument } from '@/lib/pdf-generator';

interface UserSubscription {
  plan: 'free' | 'pro';
  pdfsDownloaded: number;
  pdfsLimit: number;
}

export default function PDFPreview() {
  const { t } = useTranslation();
  const router = useRouter();
  const [pdfData, setPdfData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    pdfsDownloaded: 0,
    pdfsLimit: 1
  });

  useEffect(() => {
    loadPDFData();
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      // Fetch real subscription data from API
      const response = await fetch('/api/subscription/check');
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          plan: data.plan || 'free',
          pdfsDownloaded: data.pdfs_used || 0,
          pdfsLimit: data.pdfs_limit || 1
        });
      } else {
        // Fallback to free plan if API fails
        setSubscription({
          plan: 'free',
          pdfsDownloaded: 0,
          pdfsLimit: 1
        });
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      // Fallback to free plan
      setSubscription({
        plan: 'free',
        pdfsDownloaded: 0,
        pdfsLimit: 1
      });
    }
  };

  const loadPDFData = () => {
    // Load data from localStorage
    const ideaData = JSON.parse(localStorage.getItem('currentIdea') || '{}');
    const bmcAnswers = JSON.parse(localStorage.getItem('bmcAnswers') || '{}');
    const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
    const completedNodes = JSON.parse(localStorage.getItem('completedNodes') || '[]');

    const mockPDFData = {
      idea: {
        text: ideaData.text || 'Sample business idea',
        category: ideaData.analysis?.category || 'Technology',
        created_at: new Date().toISOString()
      },
      bmcAnswers: Object.keys(bmcAnswers).length > 0 ? bmcAnswers : undefined,
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
      resources: getResourceRecommendations(
        ideaData.idea_type || ideaData.category || 'general',
        ideaData.category || 'general'
      ),
      youtubeChannels: getYouTubeChannelRecommendations(
        ideaData.idea_type || ideaData.category || 'general'
      ),
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    };

    setPdfData(mockPDFData);
  };

  const handleDownload = async () => {
    // Check if user has available PDFs
    const pdfsRemaining = subscription.pdfsLimit - subscription.pdfsDownloaded;
    
    if (pdfsRemaining > 0) {
      // User has free downloads available
      await generateAndDownloadPDF();
      
      // Update subscription count in database
      try {
        await fetch('/api/subscription/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'use_pdf' })
        });
      } catch (error) {
        console.error('Failed to update PDF count:', error);
      }
      
      // Update local state
      const updatedSub = {
        ...subscription,
        pdfsDownloaded: subscription.pdfsDownloaded + 1
      };
      setSubscription(updatedSub);
      
      alert(`✅ PDF downloaded successfully! You have ${pdfsRemaining - 1} download(s) remaining.`);
    } else {
      // No free downloads left, show upgrade prompt
      if (subscription.plan === 'free') {
        const upgrade = confirm('You have used your free PDF download. Upgrade to Pro Monthly ($20/month) for 20 PDF downloads. Upgrade now?');
        if (upgrade) {
          router.push('/subscription/checkout');
        }
      } else {
        // Pro user who exceeded limit
        alert('You have reached your monthly PDF download limit. Your limit will reset at the start of next billing cycle.');
      }
    }
  };

  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF
      const pdfBlob = await generatePDF();
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-blueprint-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  const generatePDF = async () => {
    try {
      // Get BMC answers from localStorage
      const bmcAnswers = JSON.parse(localStorage.getItem('bmcAnswers') || '{}');
      
      // Prepare PDF data
      const pdfDataForGeneration = {
        idea: {
          name: pdfData.idea?.name || 'My Business Idea',
          text: pdfData.idea?.text || 'No description provided',
          category: pdfData.idea?.category || 'General',
          type: pdfData.idea?.idea_type || pdfData.idea?.type || 'General Business',
          country: pdfData.idea?.country || 'Not specified',
          founders: pdfData.idea?.founders || []
        },
        pathContent: pdfData.pathContent || {},
        responses: pdfData.responses || [],
        bmcAnswers: bmcAnswers,
        analysis: {
          idea_type: pdfData.analysis?.idea_type || pdfData.idea?.type || 'General',
          field: pdfData.analysis?.field || pdfData.idea?.category || 'General',
          competitors: pdfData.analysis?.competitors || []
        }
      };

      console.log('Generating PDF with data:', pdfDataForGeneration);

      // Generate PDF using pdf-generator
      const pdfBlob = await generatePDFDocument(pdfDataForGeneration);
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }
      
      return pdfBlob;
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please check console for details.');
      throw error;
    }
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
                    {pdfData.responses.map((response: any, index: number) => (
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
                  {Object.entries(pdfData.pathContent as Record<string, string[]>).map(([category, steps]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <ul className="space-y-1">
                        {steps.map((step, index) => (
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
              {pdfData.resources && pdfData.resources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Recommended Learning Resources
                  </h3>
                  <div className="space-y-4">
                    {pdfData.resources.map((resource: any, index: number) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg border border-blue-100 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                              </div>
                              <Badge variant="secondary" className="ml-2 capitalize">
                                {resource.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{resource.description}</p>
                            {resource.platform && (
                              <p className="text-xs text-gray-500">Platform: {resource.platform}</p>
                            )}
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube Channels */}
              {pdfData.youtubeChannels && pdfData.youtubeChannels.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Video className="w-5 h-5 mr-2 text-red-600" />
                    Recommended YouTube Channels
                  </h3>
                  <div className="space-y-4">
                    {pdfData.youtubeChannels.map((channel: any, index: number) => (
                      <a
                        key={index}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-lg border border-red-100 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                              {channel.name}
                            </div>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors ml-2 flex-shrink-0" />
                        </div>
                      </a>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Business Blueprint with BMC</h3>
                <p className="text-gray-600 text-sm">
                  Complete business blueprint including Business Model Canvas as a professional PDF
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Your Plan</span>
                  <span className={`font-semibold ${subscription.plan === 'pro' ? 'text-blue-600' : 'text-gray-600'}`}>
                    {subscription.plan === 'pro' ? 'Pro Monthly' : 'Free Trial'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Downloads Used</span>
                  <span className="font-semibold text-gray-900">
                    {subscription.pdfsDownloaded} / {subscription.pdfsLimit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Remaining</span>
                  <span className={`font-semibold ${subscription.pdfsLimit - subscription.pdfsDownloaded > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {subscription.pdfsLimit - subscription.pdfsDownloaded} download(s)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Includes</span>
                  <span className="text-gray-600">BMC + Business Plan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Format</span>
                  <span className="text-gray-600">Professional PDF</span>
                </div>
              </div>

              {subscription.pdfsLimit - subscription.pdfsDownloaded > 0 ? (
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/subscription/checkout')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Upgrade to Pro - $20/month
                </Button>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment • Instant download • 30-day money-back guarantee
              </p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
