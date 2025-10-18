'use client';

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, Quote, Users, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryPage() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "رائد أعمال",
      content: "منصة Found Your Path غيرت طريقة تفكيري في تطوير الأفكار. الذكاء الاصطناعي يساعدني في رؤية نقاط القوة والضعف في مشاريعي.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      content: "This platform is incredible! It helped me structure my business idea and create a clear roadmap. The AI analysis is spot-on and the visual path is amazing.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "محمد العلي",
      role: "مطور تطبيقات",
      content: "أفضل استثمار قمت به! المنصة وفرت علي ساعات من البحث والتخطيط. الآن لدي خطة واضحة لمشروعي الجديد.",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Emily Chen",
      role: "Product Manager",
      content: "The visual roadmap feature is brilliant. It helped me present my idea to investors with confidence. Highly recommended!",
      rating: 5,
      avatar: "👩‍💼"
    }
  ];

  const stats = [
    { number: "10,000+", label: "مستخدم نشط" },
    { number: "50,000+", label: "فكرة تم تحليلها" },
    { number: "95%", label: "معدل الرضا" },
    { number: "24/7", label: "دعم متاح" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('story.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('story.subtitle')}
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('story.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('story.videoTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('story.videoDescription')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-white shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full w-20 h-20"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">Found Your Path Demo</p>
                  <p className="text-xs opacity-80">2:30 دقيقة</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white shadow-lg h-full">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-gray-400 mb-3" />
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              ابدأ رحلتك اليوم
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف رواد الأعمال الذين حولوا أفكارهم إلى مشاريع ناجحة
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              ابدأ مجاناً الآن
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
