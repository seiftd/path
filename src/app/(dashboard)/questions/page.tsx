'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Loader2, HelpCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getBMCSections, BMCSection, BMCAnswers } from '@/lib/bmc-questions';

export default function Questions() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [bmcSections, setBmcSections] = useState<BMCSection[]>([]);
  const [answers, setAnswers] = useState<BMCAnswers>({} as BMCAnswers);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<{title: string, content: string, examples: string[]}>({title: '', content: '', examples: []});

  useEffect(() => {
    // Load idea data from localStorage
    const storedIdea = localStorage.getItem('currentIdea');
    if (storedIdea) {
      const idea = JSON.parse(storedIdea);
      setIdeaData(idea);
      loadBMCSections(idea.analysis?.category, idea.analysis?.idea_type);
    } else {
      router.push('/idea/new');
    }
  }, [router]);

  const loadBMCSections = async (category?: string, ideaType?: string) => {
    try {
      // Generate BMC sections based on idea type and category
      const sections = getBMCSections(ideaType, category);
      setBmcSections(sections);
      
      // Load dynamic options for each section
      for (const section of sections) {
        try {
          const response = await fetch('/api/ai/bmc-options', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ideaType,
              category,
              bmcSection: section.id,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Update section with dynamic options
            section.options = data.options || section.options;
          }
        } catch (error) {
          console.warn(`Failed to load options for ${section.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error loading BMC sections:', error);
      // Fallback to basic sections
      setBmcSections(getBMCSections());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    const currentSection = bmcSections[currentQuestionIndex];
    if (currentSection) {
      setAnswers(prev => ({
        ...prev,
        [currentSection.id as keyof BMCAnswers]: answer
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < bmcSections.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All BMC sections completed, proceed to path generation
      localStorage.setItem('bmcAnswers', JSON.stringify(answers));
      router.push('/path/generate');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleShowExplanation = (section: BMCSection) => {
    setCurrentExplanation({
      title: section.title,
      content: section.explanation,
      examples: section.examples
    });
    setShowExplanation(true);
  };

  const currentSection = bmcSections[currentQuestionIndex];
  const currentAnswer = currentSection ? answers[currentSection.id as keyof BMCAnswers] || '' : '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading Business Model Canvas questions...</p>
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available. Please try again.</p>
          <Button onClick={() => router.push('/idea/new')} className="mt-4">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Business Model Canvas
          </h1>
          <p className="text-xl text-gray-600">
            Let's build your complete business model step by step
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Section {currentQuestionIndex + 1} of {bmcSections.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / bmcSections.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / bmcSections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* BMC Section Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {currentSection.title}
                  </h2>
                  <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowExplanation(currentSection)}
                        className="flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Explanation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{currentExplanation.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-700">{currentExplanation.content}</p>
                        {currentExplanation.examples.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Examples:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {currentExplanation.examples.map((example, index) => (
                                <li key={index}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  {currentSection.question}
                </p>
                
                <div className="space-y-3">
                  {currentSection.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700 flex-1">{option}</span>
                      {currentAnswer === option && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {currentQuestionIndex < bmcSections.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Next Section
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Generate My Business Model
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}