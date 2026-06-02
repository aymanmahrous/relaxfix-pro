import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Settings,
  BarChart3,
  MapPin,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "services" | "analytics"
  >("overview");

  // Fetch analytics data
  const { data: recentOrders = [] } = trpc.order.getMyOrders.useQuery();
  const { data: services = [] } = trpc.service.getAll.useQuery();
  
  // Mock stats for now
  const stats = {
    totalUsers: 150,
    dailyOrders: 12,
    monthlyRevenue: 45000,
    pendingOrders: 3,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gold-400">جاري التحميل...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              لوحة التحكم الإدارية
            </h1>
            <p className="text-gray-400">إدارة شاملة للمنصة والمستخدمين</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gold-500/20">
          {[
            { id: "overview", label: "نظرة عامة", icon: "📊" },
            { id: "users", label: "المستخدمين", icon: "👥" },
            { id: "services", label: "الخدمات", icon: "🔧" },
            { id: "analytics", label: "التحليلات", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab.id
                  ? "text-gold-400 border-b-2 border-gold-400"
                  : "text-gray-400 hover:text-gold-300"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  label: "إجمالي المستخدمين",
                  value: stats?.totalUsers || 0,
                  icon: Users,
                  color: "from-blue-500/20 to-blue-600/20",
                },
                {
                  label: "الطلبات اليومية",
                  value: stats?.dailyOrders || 0,
                  icon: TrendingUp,
                  color: "from-purple-500/20 to-purple-600/20",
                },
                {
                  label: "الإيرادات الشهرية",
                  value: `${stats?.monthlyRevenue || 0} درهم`,
                  icon: DollarSign,
                  color: "from-green-500/20 to-green-600/20",
                },
                {
                  label: "الطلبات المعلقة",
                  value: stats?.pendingOrders || 0,
                  icon: AlertCircle,
                  color: "from-yellow-500/20 to-yellow-600/20",
                },
              ].map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <Card
                    key={i}
                    className={`bg-gradient-to-br ${metric.color} border-gold-500/20 p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          {metric.label}
                        </p>
                        <p className="text-3xl font-bold text-gold-400">
                          {metric.value}
                        </p>
                      </div>
                      <Icon className="w-8 h-8 text-gold-400 opacity-50" />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">
                الطلبات الأخيرة
              </h2>
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/30 border-b border-gold-500/20">
                      <tr>
                        <th className="px-6 py-3 text-right text-sm font-semibold">
                          رقم الطلب
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">
                          العميل
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">
                          الخدمة
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">
                          المبلغ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(recentOrders as any[])?.map((order: any) => (
                        <tr
                          key={order.id}
                          className="border-b border-gold-500/10 hover:bg-gold-500/5 transition"
                        >
                          <td className="px-6 py-3 text-sm">
                            #{order.orderNumber}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            {order.serviceName}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {order.status === "completed"
                                ? "مكتمل"
                                : "قيد التنفيذ"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gold-400 font-semibold">
                            {order.totalPrice} درهم
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">إدارة المستخدمين</h2>
              <Button className="bg-gold-400 text-black hover:bg-gold-500">
                إضافة مستخدم
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/30 border-b border-gold-500/20">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">
                        البريد
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">
                        النوع
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[].map((u: any) => (
                      <tr
                        key={u.id}
                        className="border-b border-gold-500/10 hover:bg-gold-500/5 transition"
                      >
                        <td className="px-6 py-3 text-sm">{u.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-400">
                          {u.email}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-red-500/20 text-red-400"
                                : u.role === "technician"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {u.role === "admin"
                              ? "مدير"
                              : u.role === "technician"
                                ? "فني"
                                : "عميل"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              u.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {u.isActive ? "نشط" : "معطل"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gold-400 text-gold-400"
                          >
                            تعديل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">إدارة الخدمات</h2>
              <Button className="bg-gold-400 text-black hover:bg-gold-500">
                إضافة خدمة
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {(services as any[])?.map((service: any) => (
                <Card
                  key={service.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gold-400 font-semibold">
                          {service.basePrice} درهم
                        </span>
                        <span className="text-gray-400">
                          {service.estimatedDuration} دقيقة
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gold-500/20">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gold-400 text-gold-400"
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-400 text-red-400"
                    >
                      حذف
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">التحليلات المتقدمة</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gold-400" />
                  الإيرادات الشهرية
                </h3>
                <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">جاري تحميل الرسم البياني...</p>
                </div>
              </Card>

              {/* Orders Distribution */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold-400" />
                  توزيع الطلبات
                </h3>
                <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">جاري تحميل الرسم البياني...</p>
                </div>
              </Card>

              {/* Geographic Distribution */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-gold-500/20 p-6 md:col-span-2">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-400" />
                  التوزيع الجغرافي
                </h3>
                <div className="h-96 bg-black/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">جاري تحميل الخريطة...</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
