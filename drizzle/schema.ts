import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  datetime,
  double,
  longtext,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow with role-based access control.
 * Supports three roles: customer, technician, admin
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profileImage"),
  role: mysqlEnum("role", ["customer", "technician", "admin"]).default("customer").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customer profile with additional information
 */
export const customerProfiles = mysqlTable("customer_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  area: varchar("area", { length: 100 }),
  latitude: double("latitude"),
  longitude: double("longitude"),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).default("0").notNull(),
  loyaltyPoints: int("loyaltyPoints").default(0).notNull(),
  walletBalance: decimal("walletBalance", { precision: 10, scale: 2 }).default("0").notNull(),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = typeof customerProfiles.$inferInsert;

/**
 * Technician profile with skills and availability
 */
export const technicianProfiles = mysqlTable("technician_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bio: text("bio"),
  experience: int("experience"),
  certifications: json("certifications"),
  isVerified: boolean("isVerified").default(false).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  currentLatitude: double("currentLatitude"),
  currentLongitude: double("currentLongitude"),
  totalJobs: int("totalJobs").default(0).notNull(),
  totalEarnings: decimal("totalEarnings", { precision: 10, scale: 2 }).default("0").notNull(),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0").notNull(),
  responseTime: int("responseTime"), // in minutes
  completionRate: decimal("completionRate", { precision: 5, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechnicianProfile = typeof technicianProfiles.$inferSelect;
export type InsertTechnicianProfile = typeof technicianProfiles.$inferInsert;

/**
 * Services/Professions available on the platform
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: text("icon"), // URL or SVG
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Geographic areas/zones for service coverage
 */
export const areas = mysqlTable("areas", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  latitude: double("latitude").notNull(),
  longitude: double("longitude").notNull(),
  radius: int("radius").notNull(), // in kilometers
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Area = typeof areas.$inferSelect;
export type InsertArea = typeof areas.$inferInsert;

/**
 * Junction table: Technicians and their services
 */
export const technicianServices = mysqlTable("technician_services", {
  id: int("id").autoincrement().primaryKey(),
  technicianId: int("technicianId").notNull(),
  serviceId: int("serviceId").notNull(),
  pricePerHour: decimal("pricePerHour", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TechnicianService = typeof technicianServices.$inferSelect;
export type InsertTechnicianService = typeof technicianServices.$inferInsert;

/**
 * Junction table: Technicians and their service areas
 */
export const technicianAreas = mysqlTable("technician_areas", {
  id: int("id").autoincrement().primaryKey(),
  technicianId: int("technicianId").notNull(),
  areaId: int("areaId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TechnicianArea = typeof technicianAreas.$inferSelect;
export type InsertTechnicianArea = typeof technicianAreas.$inferInsert;

/**
 * Service orders/requests
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerId: int("customerId").notNull(),
  serviceId: int("serviceId").notNull(),
  technicianId: int("technicianId"),
  areaId: int("areaId").notNull(),
  status: mysqlEnum("status", ["pending", "assigned", "in-progress", "completed", "cancelled"]).default("pending").notNull(),
  scheduledDate: datetime("scheduledDate").notNull(),
  completedDate: datetime("completedDate"),
  customerLatitude: double("customerLatitude"),
  customerLongitude: double("customerLongitude"),
  customerAddress: text("customerAddress"),
  description: text("description"),
  images: json("images"), // Array of image URLs
  estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
  finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["stripe", "wallet", "cash"]).default("stripe").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order status history for tracking
 */
export const orderStatusHistory = mysqlTable("order_status_history", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  status: mysqlEnum("status", ["pending", "assigned", "in-progress", "completed", "cancelled"]).notNull(),
  changedBy: int("changedBy").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = typeof orderStatusHistory.$inferInsert;

/**
 * Reviews and ratings for technicians
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().unique(),
  customerId: int("customerId").notNull(),
  technicianId: int("technicianId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  images: json("images"), // After/before photos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Payments and transactions
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  customerId: int("customerId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["stripe", "wallet", "cash"]).notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Notifications system
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // order_update, reminder, promotion, etc.
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  orderId: int("orderId"),
  isRead: boolean("isRead").default(false).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Promotional coupons and discounts
 */
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  maxUses: int("maxUses"),
  currentUses: int("currentUses").default(0).notNull(),
  minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 }),
  expiryDate: datetime("expiryDate"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

/**
 * Advertisements/Banners in the app
 */
export const advertisements = mysqlTable("advertisements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  targetUrl: text("targetUrl"),
  position: varchar("position", { length: 50 }).notNull(), // home_banner, service_card, etc.
  priority: int("priority").default(0).notNull(),
  startDate: datetime("startDate"),
  endDate: datetime("endDate"),
  isActive: boolean("isActive").default(true).notNull(),
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Advertisement = typeof advertisements.$inferSelect;
export type InsertAdvertisement = typeof advertisements.$inferInsert;

/**
 * Loyalty points and rewards
 */
export const loyaltyTransactions = mysqlTable("loyalty_transactions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  points: int("points").notNull(),
  type: mysqlEnum("type", ["earned", "redeemed", "expired"]).notNull(),
  orderId: int("orderId"),
  description: text("description"),
  expiryDate: datetime("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

/**
 * Wallet transactions
 */
export const walletTransactions = mysqlTable("wallet_transactions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["topup", "payment", "refund"]).notNull(),
  orderId: int("orderId"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;

/**
 * Scheduled tasks for reminders and notifications
 */
export const scheduledTasks = mysqlTable("scheduled_tasks", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  taskType: varchar("taskType", { length: 50 }).notNull(), // reminder_24h, reminder_1h, etc.
  scheduledFor: datetime("scheduledFor").notNull(),
  isExecuted: boolean("isExecuted").default(false).notNull(),
  executedAt: timestamp("executedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

/**
 * Invoices for orders
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  orderId: int("orderId").notNull().unique(),
  customerId: int("customerId").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).default("0").notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  pdfUrl: text("pdfUrl"),
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Marketing campaigns
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // email, sms, push, etc.
  targetAudience: varchar("targetAudience", { length: 100 }),
  content: longtext("content"),
  startDate: datetime("startDate"),
  endDate: datetime("endDate"),
  status: mysqlEnum("status", ["draft", "scheduled", "active", "completed"]).default("draft").notNull(),
  sentCount: int("sentCount").default(0).notNull(),
  openCount: int("openCount").default(0).notNull(),
  clickCount: int("clickCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Relations for foreign keys
 */
export const userRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
  technicianProfile: one(technicianProfiles, {
    fields: [users.id],
    references: [technicianProfiles.userId],
  }),
  orders: many(orders),
  reviews: many(reviews),
  notifications: many(notifications),
  payments: many(payments),
}));

export const serviceRelations = relations(services, ({ many }) => ({
  orders: many(orders),
  technicianServices: many(technicianServices),
}));

export const areaRelations = relations(areas, ({ many }) => ({
  orders: many(orders),
  technicianAreas: many(technicianAreas),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  technician: one(users, {
    fields: [orders.technicianId],
    references: [users.id],
  }),
  area: one(areas, {
    fields: [orders.areaId],
    references: [areas.id],
  }),
  statusHistory: many(orderStatusHistory),
  review: one(reviews, {
    fields: [orders.id],
    references: [reviews.orderId],
  }),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId],
  }),
  invoice: one(invoices, {
    fields: [orders.id],
    references: [invoices.orderId],
  }),
}));
