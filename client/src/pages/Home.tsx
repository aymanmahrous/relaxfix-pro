import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gold-500/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-serif font-bold text-gold-400">RelaxFix</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-300 hover:text-gold-400 transition">
                الخدمات
              </a>
              <a href="#features" className="text-gray-300 hover:text-gold-400 transition">
                المميزات
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-gold-400 transition">
                آراء العملاء
              </a>
              <a href="#faq" className="text-gray-300 hover:text-gold-400 transition">
                الأسئلة الشائعة
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                className="border-gold-400 text-gold-400 hover:bg-gold-400/10"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                تسجيل الدخول
              </Button>
              <Button
                className="bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-500 hover:to-gold-700"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                ابدأ الآن
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gold-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/90 border-t border-gold-500/20 py-4">
              <div className="container mx-auto px-4 flex flex-col gap-4">
                <a href="#services" className="text-gray-300 hover:text-gold-400">
                  الخدمات
                </a>
                <a href="#features" className="text-gray-300 hover:text-gold-400">
                  المميزات
                </a>
                <a href="#testimonials" className="text-gray-300 hover:text-gold-400">
                  آراء العملاء
                </a>
                <Button
                  variant="outline"
                  className="border-gold-400 text-gold-400 w-full"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  تسجيل الدخول
                </Button>
                <Button
                  className="bg-gradient-to-r from-gold-400 to-gold-600 text-black w-full"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  ابدأ الآن
                </Button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full">
                  <span className="text-gold-400 text-sm font-semibold">✨ الخدمات المنزلية الفاخرة</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                  الأناقة في كل <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">تفصيل</span>
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  منصة RelaxFix PRO تجمع بين احترافية الخدمة وفخامة التجربة. فنيون معتمدون، تتبع فوري، ودعم عملاء ممتاز.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-500 hover:to-gold-700 text-lg"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    ابدأ الآن <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gold-400 text-gold-400 hover:bg-gold-400/10 text-lg"
                  >
                    اعرف المزيد
                  </Button>
                </div>

                <div className="mt-12 flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-gold-400">500+</div>
                    <div className="text-gray-400">فني معتمد</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold-400">10K+</div>
                    <div className="text-gray-400">عملية ناجحة</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gold-400">4.9★</div>
                    <div className="text-gray-400">تقييم العملاء</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-gold-500/20">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-black/50 rounded-lg border border-gold-500/10">
                        <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-gold-400" />
                        </div>
                        <div>
                          <div className="font-semibold">خدمة متقدمة</div>
                          <div className="text-sm text-gray-400">متاحة 24/7</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 md:py-32 border-t border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                خدماتنا <span className="text-gold-400">المتنوعة</span>
              </h2>
              <p className="text-xl text-gray-400">نوفر مجموعة شاملة من الخدمات المنزلية الاحترافية</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "كهربائي", desc: "صيانة وتركيب الأنظمة الكهربائية" },
                { icon: Wrench, title: "سباك", desc: "حل جميع مشاكل السباكة والمياه" },
                { icon: Clock, title: "تكييف", desc: "صيانة وتنظيف أنظمة التكييف" },
              ].map((service, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 hover:border-gold-500/50 transition p-8 group"
                >
                  <div className="w-16 h-16 bg-gold-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500/30 transition">
                    <service.icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.desc}</p>
                  <Button
                    variant="ghost"
                    className="text-gold-400 hover:text-gold-300 p-0"
                  >
                    اعرف المزيد <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 border-t border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">
                  لماذا <span className="text-gold-400">RelaxFix PRO</span>؟
                </h2>

                <div className="space-y-6">
                  {[
                    { title: "فنيون معتمدون", desc: "جميع الفنيين لديهم شهادات معتمدة وخبرة عملية" },
                    { title: "تتبع فوري", desc: "تابع موقع الفني في الوقت الفعلي على الخريطة" },
                    { title: "أسعار شفافة", desc: "لا توجد رسوم مخفية، سعر ثابت وواضح" },
                    { title: "ضمان الرضا", desc: "ضمان 100% على جودة الخدمة أو استرجاع المبلغ" },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-gold-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent rounded-2xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-gold-500/20">
                  <div className="space-y-4">
                    <div className="h-32 bg-gold-500/10 rounded-lg border border-gold-500/20" />
                    <div className="h-32 bg-gold-500/10 rounded-lg border border-gold-500/20" />
                    <div className="h-32 bg-gold-500/10 rounded-lg border border-gold-500/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 border-t border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                آراء <span className="text-gold-400">عملائنا</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "أحمد محمد", rating: 5, text: "خدمة ممتازة وفني احترافي جداً. أنصح به بشدة!" },
                { name: "فاطمة علي", rating: 5, text: "أول مرة أستخدم التطبيق والتجربة كانت رائعة جداً." },
                { name: "محمود سالم", rating: 5, text: "التتبع الفوري والشفافية في الأسعار جعلت التجربة مريحة." },
              ].map((testimonial, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-8"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">{testimonial.text}</p>
                  <div className="font-semibold text-gold-400">{testimonial.name}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32 border-t border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                الأسئلة <span className="text-gold-400">الشائعة</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "كيف أطلب خدمة؟", a: "قم بتحميل التطبيق، اختر الخدمة، حدد الموقع، وأكمل الدفع." },
                { q: "هل يمكنني تتبع الفني؟", a: "نعم، يمكنك تتبع موقع الفني في الوقت الفعلي على الخريطة." },
                { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل بطاقات الائتمان والمحافظ الرقمية والدفع عند الاستلام." },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6"
                >
                  <h3 className="font-bold text-lg mb-3 text-gold-400">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 border-t border-gold-500/10">
          <div className="container mx-auto px-4">
            <div className="relative bg-gradient-to-r from-gold-500/20 to-gold-500/5 rounded-2xl border border-gold-500/30 p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                  ابدأ تجربتك الآن
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  انضم إلى آلاف العملاء الراضين واستمتع بخدمات منزلية احترافية وموثوقة
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-500 hover:to-gold-700 text-lg"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  تحميل التطبيق الآن
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gold-500/10 py-12 bg-black/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-serif font-bold text-gold-400">RelaxFix</span>
                </div>
                <p className="text-gray-400">منصة الخدمات المنزلية الفاخرة</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gold-400">الخدمات</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-gold-400">كهربائي</a></li>
                  <li><a href="#" className="hover:text-gold-400">سباك</a></li>
                  <li><a href="#" className="hover:text-gold-400">تكييف</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gold-400">الشركة</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-gold-400">من نحن</a></li>
                  <li><a href="#" className="hover:text-gold-400">الوظائف</a></li>
                  <li><a href="#" className="hover:text-gold-400">الاتصال</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gold-400">قانوني</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-gold-400">الشروط</a></li>
                  <li><a href="#" className="hover:text-gold-400">الخصوصية</a></li>
                  <li><a href="#" className="hover:text-gold-400">الأمان</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gold-500/10 pt-8 text-center text-gray-400">
              <p>&copy; 2026 RelaxFix PRO. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}
