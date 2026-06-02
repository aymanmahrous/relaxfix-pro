import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // Fetch customer orders
  const { data: orders = [], isLoading: ordersLoading } =
    trpc.order.getMyOrders.useQuery();

  // Fetch customer profile
  const { data: profile } = trpc.customer.getProfile.useQuery();

  if (loading || ordersLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-yellow-400">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "assigned":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in-progress":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "قيد الانتظار",
      assigned: "تم التعيين",
      "in-progress": "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغي",
    };
    return labels[status] || status;
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
            <p className="text-gray-400">إدارة طلبات الخدمة والتتبع الفوري</p>
          </div>
          <Button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            onClick={() => navigate("/customer/new-order")}
          >
            <Plus className="w-5 h-5 ml-2" />
            طلب خدمة جديد
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              label: "الطلبات الكلية",
              value: orders.length,
              icon: "📊",
              color: "from-blue-500/20 to-blue-600/20",
            },
            {
              label: "قيد التنفيذ",
              value: orders.filter((o) => o.status === "in-progress").length,
              icon: "⚙️",
              color: "from-purple-500/20 to-purple-600/20",
            },
            {
              label: "مكتملة",
              value: orders.filter((o) => o.status === "completed").length,
              icon: "✅",
              color: "from-green-500/20 to-green-600/20",
            },
            {
              label: "النقاط المكتسبة",
              value: profile?.loyaltyPoints || 0,
              icon: "⭐",
              color: "from-yellow-500/20 to-yellow-600/20",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-yellow-500/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {stat.value}
                  </p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6">طلباتي</h2>

          {orders.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-yellow-500/20 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">لا توجد طلبات حالياً</p>
              <Button
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                onClick={() => navigate("/customer/new-order")}
              >
                طلب خدمة الآن
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-yellow-500/20 p-6 hover:border-yellow-500/50 transition cursor-pointer"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order.id ? null : order.id
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          طلب رقم {order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {order.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(order.scheduledDate).toLocaleDateString(
                            "ar-AE"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {order.customerAddress}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {order.estimatedPrice || "قيد التقدير"} درهم
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        السعر المتوقع
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-yellow-500/20 space-y-4">
                      {/* Technician Info */}
                      {order.technicianId && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <h4 className="font-bold mb-3 text-yellow-400">
                            معلومات الفني
                          </h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">فني معتمد</p>
                              <p className="text-sm text-gray-400">
                                متوسط التقييم: 4.8 ⭐
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-400 text-yellow-400"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-400 text-yellow-400"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Live Tracking */}
                      {order.status === "in-progress" && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <h4 className="font-bold mb-3 text-yellow-400">
                            التتبع الفوري
                          </h4>
                          <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-yellow-400" />
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            الفني في الطريق إليك - وقت الوصول: 15 دقيقة
                          </p>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="bg-black/30 rounded-lg p-4">
                        <h4 className="font-bold mb-3 text-yellow-400">
                          سجل الطلب
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>تم استقبال الطلب</span>
                            <span className="text-gray-500 ml-auto">
                              اليوم
                            </span>
                          </div>
                          {order.status !== "pending" && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span>تم تعيين فني</span>
                              <span className="text-gray-500 ml-auto">
                                اليوم
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-yellow-400 text-yellow-400"
                            >
                              تعديل الطلب
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-red-400 text-red-400"
                            >
                              إلغاء الطلب
                            </Button>
                          </div>
                        )}

                      {order.status === "completed" && (
                        <Button
                          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                          onClick={() => navigate(`/customer/review/${order.id}`)}
                        >
                          <Star className="w-4 h-4 ml-2" />
                          تقييم الخدمة
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
