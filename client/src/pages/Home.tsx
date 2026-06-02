import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import {
  Wrench,
  Zap,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";


export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use useEffect to handle navigation
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/customer/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500 text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-yellow-500/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-serif font-bold text-yellow-400">RelaxFix</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-300 hover:text-yellow-400 transition">الخدمات</a>
              <a href="#features" className="text-gray-300 hover:text-yellow-400 transition">المميزات</a>
              <a href="#testimonials" className="text-gray-300 hover:text-yellow-400 transition">الآراء</a>
              <a href="#faq" className="text-gray-300 hover:text-yellow-400 transition">الأسئلة</a>
              <a href={getLoginUrl()} className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition">
                تسجيل الدخول
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-yellow-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/95 border-t border-yellow-500/20 p-4 space-y-4">
              <a href="#services" className="block text-gray-300 hover:text-yellow-400">الخدمات</a>
              <a href="#features" className="block text-gray-300 hover:text-yellow-400">المميزات</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-yellow-400">الآراء</a>
              <a href="#faq" className="block text-gray-300 hover:text-yellow-400">الأسئلة</a>
              <a href={getLoginUrl()} className="block px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold text-center">
                تسجيل الدخول
              </a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            الباقة في كل مكان
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            تجمع بين احترافية الخدمة وفخامة التجربة. فنيين معتمدين، تقنية فوري، ودعم عملاء ممتاز.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={getLoginUrl()} className="px-8 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition flex items-center gap-2">
              ابدأ الآن <ArrowRight className="w-5 h-5" />
            </a>
            <button className="px-8 py-3 border border-yellow-500/50 text-yellow-400 rounded-lg font-bold hover:bg-yellow-500/10 transition">
              اعرف المزيد
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-yellow-500/10 to-transparent py-12 border-y border-yellow-500/20">
          <div className="container mx-auto px-4 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400">500+</div>
              <div className="text-gray-400">خدمة مكتملة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">10K+</div>
              <div className="text-gray-400">عميل راضي</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">4.9★</div>
              <div className="text-gray-400">تقييم العملاء</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-yellow-400">خدماتنا المتنوعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Wrench, title: "خدمة متقدمة", desc: "صيانة واصلاح احترافي" },
              { icon: Zap, title: "خدمة متقدمة", desc: "صيانة واصلاح احترافي" },
              { icon: MapPin, title: "خدمة متقدمة", desc: "صيانة واصلاح احترافي" },
            ].map((service, i) => (
              <Card key={i} className="bg-slate-900/50 border-yellow-500/20 p-6 hover:border-yellow-500/50 transition">
                <service.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-yellow-400">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-900/30 py-20 border-y border-yellow-500/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 text-yellow-400">مميزاتنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Clock, title: "سرعة الخدمة", desc: "استجابة فورية للطلبات" },
                { icon: Star, title: "جودة عالية", desc: "فنيين معتمدين ومدربين" },
                { icon: MapPin, title: "تتبع فوري", desc: "تتبع الفني بالموقع الحي" },
                { icon: Zap, title: "دعم 24/7", desc: "دعم عملاء متاح طوال الوقت" },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <feature.icon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-yellow-400">آراء عملائنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "أحمد محمد", rating: 5, text: "خدمة ممتازة وفنيين احترافيين" },
              { name: "فاطمة علي", rating: 5, text: "سرعة في الاستجابة وجودة عالية" },
              { name: "محمود حسن", rating: 5, text: "أفضل منصة للخدمات المنزلية" },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-slate-900/50 border-yellow-500/20 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{testimonial.text}</p>
                <p className="font-bold text-yellow-400">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-slate-900/30 py-20 border-y border-yellow-500/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif font-bold text-center mb-12 text-yellow-400">الأسئلة الشائعة</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                { q: "كيف أطلب خدمة؟", a: "سجل الدخول واختر الخدمة المطلوبة ثم حدد الموقع والموعد" },
                { q: "هل الفنيين معتمدين؟", a: "نعم، جميع الفنيين معتمدين ومدربين على أعلى مستويات" },
                { q: "كم تكلفة الخدمة؟", a: "التكلفة تختلف حسب نوع الخدمة والموقع" },
              ].map((faq, i) => (
                <Card key={i} className="bg-slate-900/50 border-yellow-500/20 p-6">
                  <h3 className="font-bold text-yellow-400 mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-yellow-400">جاهز للبدء؟</h2>
          <p className="text-xl text-gray-300 mb-8">انضم إلى آلاف العملاء الراضين</p>
          <a href={getLoginUrl()} className="inline-block px-8 py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition">
            ابدأ الآن
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-yellow-500/20 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2026 RelaxFix PRO. جميع الحقوق محفوظة</p>
          </div>
        </footer>
    </div>
  );
}
