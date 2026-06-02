import { eq, and, or, desc, asc, gte, lte, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  customerProfiles,
  technicianProfiles,
  services,
  areas,
  orders,
  reviews,
  payments,
  notifications,
  coupons,
  loyaltyTransactions,
  walletTransactions,
  invoices,
  technicianServices,
  technicianAreas,
  orderStatusHistory,
  scheduledTasks,
  campaigns,
  advertisements,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * User Management
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "profileImage"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers(role?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (role) {
    return await db.select().from(users).where(eq(users.role, role as any));
  }
  return await db.select().from(users);
}

/**
 * Customer Profile Management
 */
export async function createCustomerProfile(customerId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(customerProfiles).values({
    userId: customerId,
    ...data,
  });
  return result;
}

export async function getCustomerProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(customerProfiles)
    .where(eq(customerProfiles.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCustomerProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(customerProfiles)
    .set(data)
    .where(eq(customerProfiles.userId, userId));
}

/**
 * Technician Profile Management
 */
export async function createTechnicianProfile(technicianId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(technicianProfiles).values({
    userId: technicianId,
    ...data,
  });
}

export async function getTechnicianProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(technicianProfiles)
    .where(eq(technicianProfiles.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateTechnicianProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  return await db
    .update(technicianProfiles)
    .set(data)
    .where(eq(technicianProfiles.userId, userId));
}

export async function getAvailableTechnicians(serviceId: number, areaId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(technicianProfiles)
    .innerJoin(technicianServices, eq(technicianServices.technicianId, technicianProfiles.userId))
    .innerJoin(technicianAreas, eq(technicianAreas.technicianId, technicianProfiles.userId))
    .where(
      and(
        eq(technicianServices.serviceId, serviceId),
        eq(technicianAreas.areaId, areaId),
        eq(technicianProfiles.isAvailable, true),
        eq(technicianProfiles.isVerified, true)
      )
    );
}

/**
 * Service Management
 */
export async function createService(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(services).values(data);
}

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).where(eq(services.isActive, true));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateService(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.update(services).set(data).where(eq(services.id, id));
}

/**
 * Area Management
 */
export async function createArea(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(areas).values(data);
}

export async function getAllAreas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(areas).where(eq(areas.isActive, true));
}

export async function getAreaById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(areas).where(eq(areas.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Order Management
 */
export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(orders).values(data);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCustomerOrders(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getTechnicianOrders(technicianId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(orders)
    .where(eq(orders.technicianId, technicianId))
    .orderBy(desc(orders.createdAt));
}

export async function getAvailableOrders(serviceId?: number, areaId?: number) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(orders.status, "pending")];
  if (serviceId) conditions.push(eq(orders.serviceId, serviceId));
  if (areaId) conditions.push(eq(orders.areaId, areaId));

  return await db.select().from(orders).where(and(...conditions));
}

export async function updateOrder(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.update(orders).set(data).where(eq(orders.id, id));
}

/**
 * Review Management
 */
export async function createReview(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(reviews).values(data);
}

export async function getReviewsByTechnician(technicianId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.technicianId, technicianId))
    .orderBy(desc(reviews.createdAt));
}

/**
 * Payment Management
 */
export async function createPayment(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(payments).values(data);
}

export async function getPaymentByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePayment(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.update(payments).set(data).where(eq(payments.id, id));
}

/**
 * Notification Management
 */
export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) return null;
  return await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, id));
}

/**
 * Coupon Management
 */
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, true)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function validateCoupon(code: string, orderAmount: number) {
  const coupon = await getCouponByCode(code);
  if (!coupon) return null;

  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) return null;
  if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) return null;
  if (coupon.expiryDate && new Date() > coupon.expiryDate) return null;

  return coupon;
}

/**
 * Loyalty Points Management
 */
export async function addLoyaltyPoints(customerId: number, points: number, description?: string) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(loyaltyTransactions).values({
    customerId,
    points,
    type: "earned",
    description,
  });

  const profile = await getCustomerProfile(customerId);
  if (profile) {
    await updateCustomerProfile(customerId, {
      loyaltyPoints: (profile.loyaltyPoints || 0) + points,
    });
  }
}

/**
 * Wallet Management
 */
export async function addWalletBalance(customerId: number, amount: number, type: string) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(walletTransactions).values({
    customerId,
    amount: amount as any,
    type: type as any,
  });

  const profile = await getCustomerProfile(customerId);
  if (profile) {
    const newBalance = Number(profile.walletBalance || 0) + amount;
    await updateCustomerProfile(customerId, {
      walletBalance: newBalance as any,
    });
  }
}

/**
 * Invoice Management
 */
export async function createInvoice(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(invoices).values(data);
}

export async function getInvoiceByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(invoices).where(eq(invoices.orderId, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Scheduled Tasks Management
 */
export async function createScheduledTask(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(scheduledTasks).values(data);
}

export async function getPendingScheduledTasks() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scheduledTasks)
    .where(and(eq(scheduledTasks.isExecuted, false), lte(scheduledTasks.scheduledFor, new Date())));
}

export async function markTaskAsExecuted(id: number) {
  const db = await getDb();
  if (!db) return null;
  return await db
    .update(scheduledTasks)
    .set({ isExecuted: true, executedAt: new Date() })
    .where(eq(scheduledTasks.id, id));
}

/**
 * Coupon Management (Create)
 */
export async function createCoupon(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(coupons).values(data);
}

/**
 * Campaign Management
 */
export async function createCampaign(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(campaigns).values(data);
}

export async function getAllCampaigns() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
}

/**
 * Advertisement Management
 */
export async function createAdvertisement(data: any) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(advertisements).values(data);
}

export async function getActiveAdvertisements(position?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(advertisements.isActive, true)];
  if (position) conditions.push(eq(advertisements.position, position));

  return await db
    .select()
    .from(advertisements)
    .where(and(...conditions))
    .orderBy(asc(advertisements.priority));
}

/**
 * Order Status History
 */
export async function addOrderStatusHistory(orderId: number, status: string, changedBy: number, notes?: string) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(orderStatusHistory).values({
    orderId,
    status: status as any,
    changedBy,
    notes,
  });
}

export async function getOrderStatusHistory(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, orderId))
    .orderBy(asc(orderStatusHistory.createdAt));
}
