import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Mic,
  Navigation,
  Phone,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function TechnicianDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch available orders
  const { data: availableOrders = [] } =
    trpc.technician.getAvailableOrders.useQuery({});

  // Fetch assigned orders
  const { data: assignedOrders = [] } =
    trpc.technician.getMyOrders.useQuery();

  // Fetch technician profile
  const { data: profile } = trpc.technician.getProfile.useQuery();

  // Mutation to accept order
  const acceptOrderMutation = trpc.order.assignTechnician.useMutation();

  // Mutation to update location
  const updateLocationMutation = trpc.technician.updateLocation.useMutation();

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

  // Get user location
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Update location in database
          updateLocationMutation.mutate({
            latitude,
            longitude,
          });
        });
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await acceptOrderMutation.mutateAsync({ orderId, technicianId: user.id });
      // Refetch orders
      window.location.reload();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("حدث خطأ في قبول الطلب");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> =
      {
        pending: {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          label: "قيد الانتظار",
        },
        assigned: {
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          label: "تم التعيين",
        },
        "in-progress": {
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          label: "قيد التنفيذ",
        },
        completed: {
          bg: "bg-green-500/20",
          text: "text-green-400",
          label: "مكتمل",
        },
      };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              مرحباً، {user.name}
            </h1>
            <p className="text-gray-400">إدارة الطلبات والتتبع الفوري</p>
          </div>
          <div className="flex gap-3">
            <Button
              className={`${
                isOnline
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
              onClick={() => setIsOnline(!isOnline)}
            >
              <Navigation className="w-4 h-4 ml-2" />
              {isOnline ? "متصل" : "غير متصل"}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              label: "الطلبات المتاحة",
              value: availableOrders.length,
              icon: "📋",
            },
            {
              label: "الطلبات المعينة",
              value: assignedOrders.length,
              icon: "✅",
            },
            {
              label: "التقييم",
              value: (profile?.averageRating as any)?.toFixed?.(1) || "0",
              icon: "⭐",
            },
            {
              label: "الأرباح اليومية",
              value: `${profile?.totalEarnings || 0} درهم`,
              icon: "💰",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gold-400">
                    {stat.value}
                  </p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Available Orders */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">الطلبات المتاحة</h2>

          {availableOrders.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">لا توجد طلبات متاحة حالياً</p>
              <p className="text-sm text-gray-500">
                تحقق من الطلبات الجديدة كل بضع دقائق
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6 hover:border-gold-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          طلب رقم {order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {order.customerAddress}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(order.scheduledDate).toLocaleDateString(
                            "ar-AE"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-400 mb-2">
                        {order.estimatedPrice || "قيد التقدير"} درهم
                      </div>
                      <Button
                        className="bg-gold-400 text-black hover:bg-gold-500"
                        onClick={() => handleAcceptOrder(order.id as any)}
                        disabled={acceptOrderMutation.isPending}
                      >
                        {acceptOrderMutation.isPending
                          ? "جاري القبول..."
                          : "قبول الطلب"}
                      </Button>
                    </div>
                  </div>

                  {/* Distance Info */}
                  <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Navigation className="w-4 h-4" />
                      المسافة: 2.5 كم
                    </div>
                    <div className="text-sm text-gold-400 font-semibold">
                      وقت الوصول: 8 دقائق
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Orders */}
        {assignedOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">الطلبات المعينة</h2>
            <div className="space-y-4">
              {(assignedOrders as any[]).map((order: any) => (
                <Card
                  key={order.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        طلب رقم {order.orderNumber}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {order.customerAddress}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-400 text-gold-400"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-400 text-gold-400"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-400 text-gold-400"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2 mt-4">
                    {order.status === "assigned" && (
                      <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
                        بدء العمل
                      </Button>
                    )}
                    {order.status === "in-progress" && (
                      <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                        إنهاء العمل
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
