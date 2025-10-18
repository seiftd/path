'use client';

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, Quote, Users, TrendingUp, Award, ArrowRight, CheckCircle, Lightbulb, Target, FileText, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StoryPage() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const steps = [
    {
      number: "01",
      title: "اكتب فكرتك",
      description: "اكتب فكرة مشروعك بالتفصيل في صندوق النص",
      icon: <Lightbulb className="w-8 h-8" />,
      image: "/api/placeholder/400/300",
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02", 
      title: "التحليل بالذكاء الاصطناعي",
      description: "يقوم الذكاء الاصطناعي بتحليل فكرتك وطرح أسئلة ذكية",
      icon: <Target className="w-8 h-8" />,
      image: "/api/placeholder/400/300",
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      title: "إنشاء خريطة الطريق",
      description: "تحصل على خريطة طريق تفاعلية مخصصة لمشروعك",
      icon: <TrendingUp className="w-8 h-8" />,
      image: "/api/placeholder/400/300",
      color: "from-green-500 to-green-600"
    },
    {
      number: "04",
      title: "تحميل التقرير",
      description: "حمل تقريرك الاحترافي كملف PDF مقابل 2 دولار فقط",
      icon: <Download className="w-8 h-8" />,
      image: "/api/placeholder/400/300",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const features = [
    {
      title: "تحليل ذكي للأفكار",
      description: "يستخدم الذكاء الاصطناعي أحدث تقنيات تحليل البيانات لفهم فكرتك بشكل عميق",
      icon: "🧠"
    },
    {
      title: "أسئلة استراتيجية",
      description: "أسئلة مدروسة تساعدك في تطوير فكرتك وتحديد نقاط القوة والضعف",
      icon: "❓"
    },
    {
      title: "خريطة طريق تفاعلية",
      description: "تصور بصري لخطوات تنفيذ مشروعك مع إمكانية التفاعل والتخصيص",
      icon: "🗺️"
    },
    {
      title: "تقرير احترافي",
      description: "تقرير شامل يحتوي على تحليل السوق، الخطة المالية، والاستراتيجية",
      icon: "📊"
    }
  ];

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

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {t('story.title')}
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              {t('story.subtitle')}
            </p>
            <p className="text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              {t('story.description')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              كيف يعمل Found Your Path؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              رحلة بسيطة من الفكرة إلى الخطة التنفيذية
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white mr-4`}>
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-gray-400">الخطوة {step.number}</span>
                        <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
                        صورة شاشة {step.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              ميزات منصتنا المتقدمة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              تقنيات متطورة لتحويل أفكارك إلى مشاريع ناجحة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              شاهد منصتنا في العمل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              فيديو تعريفي يوضح كيف تحول منصتنا فكرة بسيطة إلى خطة عمل شاملة
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 bg-white shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full w-24 h-24 transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-10 h-10 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>Found Your Path - Demo</p>
                  <p className="text-sm opacity-80">3:45 دقيقة</p>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    HD
                  </div>
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
              <div
                key={index}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card className="p-8 bg-white shadow-xl h-full border-0">
                  <div className="flex items-start space-x-6">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-blue-400 mb-4" />
                      <p className="text-gray-700 mb-6 leading-relaxed text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                        "{testimonial.content}"
                      </p>
                      <div>
                        <div className="font-bold text-gray-900 text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div>
            <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              ابدأ رحلتك اليوم
            </h2>
            <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-xl" style={{ fontFamily: 'Georgia, serif' }}>
              انضم إلى آلاف رواد الأعمال الذين حولوا أفكارهم إلى مشاريع ناجحة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ابدأ مجاناً الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                شاهد الفيديو التعريفي
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
