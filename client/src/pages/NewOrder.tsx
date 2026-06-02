import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ChevronRight, MapPin, Calendar, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function NewOrder() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  // Form state
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // Fetch data
  const { data: services = [] } = trpc.service.getAll.useQuery();
  const { data: areas = [] } = trpc.area.getAll.useQuery();
  const createOrderMutation = trpc.order.create.useMutation();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gold-400">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleCreateOrder = async () => {
    if (!selectedService || !selectedArea || !scheduledDate || !address) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        serviceId: selectedService,
        areaId: selectedArea,
        scheduledDate: new Date(scheduledDate),
        customerLatitude: latitude,
        customerLongitude: longitude,
        customerAddress: address,
        description,
      });

      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("حدث خطأ في إنشاء الطلب");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">طلب خدمة جديد</h1>
          <p className="text-gray-400">الخطوة {step} من 4</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition ${
                s <= step ? "bg-gold-400" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">اختر الخدمة</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 p-6 cursor-pointer transition ${
                    selectedService === service.id
                      ? "border-gold-400 bg-gold-400/5"
                      : "border-gold-500/20 hover:border-gold-500/50"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="text-4xl mb-3">{service.icon || "🔧"}</div>
                  <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {service.description}
                  </p>
                  <p className="text-gold-400 font-semibold">
                    من {service.basePrice} درهم
                  </p>
                </Card>
              ))}
            </div>
            <Button
              className="w-full bg-gold-400 text-black hover:bg-gold-500"
              onClick={() => setStep(2)}
              disabled={!selectedService}
            >
              التالي <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Area Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">اختر المنطقة</h2>
            <div className="grid gap-3">
              {areas.map((area) => (
                <Card
                  key={area.id}
                  className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 p-4 cursor-pointer transition ${
                    selectedArea === area.id
                      ? "border-gold-400 bg-gold-400/5"
                      : "border-gold-500/20 hover:border-gold-500/50"
                  }`}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{area.name}</h3>
                      <p className="text-sm text-gray-400">
                        نطاق الخدمة: {area.radius} كم
                      </p>
                    </div>
                    <MapPin className="w-5 h-5 text-gold-400" />
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gold-400 text-gold-400"
                onClick={() => setStep(1)}
              >
                السابق
              </Button>
              <Button
                className="flex-1 bg-gold-400 text-black hover:bg-gold-500"
                onClick={() => setStep(3)}
                disabled={!selectedArea}
              >
                التالي <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Location */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">
              حدد الموعد والموقع
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4 inline ml-2" />
                  الموعد المفضل
                </label>
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="bg-slate-800 border-gold-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <MapPin className="w-4 h-4 inline ml-2" />
                  العنوان
                </label>
                <Input
                  type="text"
                  placeholder="أدخل عنوان الخدمة"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-slate-800 border-gold-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  الموقع على الخريطة
                </label>
                <div className="bg-slate-800 border border-gold-500/20 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                    <p className="text-gray-400">انقر لتحديد الموقع</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gold-400 text-gold-400"
                onClick={() => setStep(2)}
              >
                السابق
              </Button>
              <Button
                className="flex-1 bg-gold-400 text-black hover:bg-gold-500"
                onClick={() => setStep(4)}
                disabled={!scheduledDate || !address}
              >
                التالي <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">مراجعة الطلب</h2>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6 space-y-4">
              <div className="flex justify-between pb-4 border-b border-gold-500/20">
                <span className="text-gray-400">الخدمة:</span>
                <span className="font-semibold">
                  {services.find((s) => s.id === selectedService)?.name}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-gold-500/20">
                <span className="text-gray-400">المنطقة:</span>
                <span className="font-semibold">
                  {areas.find((a) => a.id === selectedArea)?.name}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-gold-500/20">
                <span className="text-gray-400">الموعد:</span>
                <span className="font-semibold">
                  {new Date(scheduledDate).toLocaleDateString("ar-AE")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">العنوان:</span>
                <span className="font-semibold text-right">{address}</span>
              </div>
            </Card>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <FileText className="w-4 h-4 inline ml-2" />
                ملاحظات إضافية (اختياري)
              </label>
              <Textarea
                placeholder="أضف أي ملاحظات أو تفاصيل إضافية..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-800 border-gold-500/20 h-24"
              />
            </div>

            <div className="bg-gold-400/10 border border-gold-500/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>ملاحظة:</strong> سيتم عرض السعر النهائي بعد تقييم الفني
                للخدمة المطلوبة.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gold-400 text-gold-400"
                onClick={() => setStep(3)}
              >
                السابق
              </Button>
              <Button
                className="flex-1 bg-gold-400 text-black hover:bg-gold-500"
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "جاري الإنشاء..." : "إنشاء الطلب"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
