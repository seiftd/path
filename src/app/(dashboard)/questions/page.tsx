'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Question {
  question: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[];
}

export default function Questions() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);

  useEffect(() => {
    // Load idea data from localStorage
    const storedIdea = localStorage.getItem('currentIdea');
    if (storedIdea) {
      const idea = JSON.parse(storedIdea);
      setIdeaData(idea);
      loadQuestions(idea.analysis?.category || 'general');
    } else {
      router.push('/idea/new');
    }
  }, [router]);

  const loadQuestions = async (category: string) => {
    try {
      const response = await fetch('/api/ai/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaText: ideaData?.text || '',
          category,
          language: 'en',
        }),
      });

      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback questions
      setQuestions([
        {
          question: 'In which country do you want to develop your idea?',
          type: 'open_ended',
        },
        {
          question: 'What is your estimated budget?',
          type: 'multiple_choice',
          options: ['$0-1,000', '$1,000-10,000', '$10,000-50,000', '$50,000+'],
        },
        {
          question: 'Who is your target audience?',
          type: 'open_ended',
        },
        {
          question: 'What makes your idea unique?',
          type: 'open_ended',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, proceed to path generation
      const allAnswers = questions.map((_, index) => answers[index] || '');
      localStorage.setItem('questionAnswers', JSON.stringify(allAnswers));
      router.push('/path/generate');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/idea/new" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Idea
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('questions.title')}
          </h1>
          <p className="text-gray-600">
            {t('questions.subtitle')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestion?.question}
                </h2>

                {currentQuestion?.type === 'multiple_choice' ? (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerChange(option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          currentAnswer === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-[120px] text-lg"
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('questions.back')}
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Generate Path' : t('questions.continue')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
