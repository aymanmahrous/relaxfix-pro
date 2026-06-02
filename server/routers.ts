import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

/**
 * User Management Router
 */
const userRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        profileImage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updateData: any = { openId: ctx.user.openId };
      if (input.name !== undefined) updateData.name = input.name;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.profileImage !== undefined) updateData.profileImage = input.profileImage;
      await db.upsertUser(updateData);
      return { success: true };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    if (ctx.user.role === "customer") {
      const profile = await db.getCustomerProfile(ctx.user.id);
      return { user, profile };
    } else if (ctx.user.role === "technician") {
      const profile = await db.getTechnicianProfile(ctx.user.id);
      return { user, profile };
    }
    return { user };
  }),

  getAllUsers: adminProcedure
    .input(z.object({ role: z.string().optional() }))
    .query(async ({ input }) => {
      return await db.getAllUsers(input.role);
    }),
});

/**
 * Customer Router
 */
const customerRouter = router({
  createProfile: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        city: z.string(),
        area: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "customer") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const result = await db.createCustomerProfile(ctx.user.id, input);
      return { success: !!result };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await db.getCustomerProfile(ctx.user.id);
  }),

  updateProfile: protectedProcedure
    .input(z.record(z.string(), z.any()))
    .mutation(async ({ input, ctx }) => {
      await db.updateCustomerProfile(ctx.user.id, input);
      return { success: true };
    }),
});

/**
 * Technician Router
 */
const technicianRouter = router({
  createProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string().optional(),
        experience: z.number().optional(),
        certifications: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "technician") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const result = await db.createTechnicianProfile(ctx.user.id, input);
      return { success: !!result };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await db.getTechnicianProfile(ctx.user.id);
  }),

  updateProfile: protectedProcedure
    .input(z.record(z.string(), z.any()))
    .mutation(async ({ input, ctx }) => {
      await db.updateTechnicianProfile(ctx.user.id, input);
      return { success: true };
    }),

  updateLocation: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.updateTechnicianProfile(ctx.user.id, {
        currentLatitude: input.latitude,
        currentLongitude: input.longitude,
      });
      return { success: true };
    }),

  getAvailableOrders: protectedProcedure
    .input(
      z.object({
        serviceId: z.number().optional(),
        areaId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await db.getAvailableOrders(input.serviceId, input.areaId);
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    return await db.getTechnicianOrders(ctx.user.id);
  }),
});

/**
 * Service Router
 */
const serviceRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        basePrice: z.number(),
        category: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.createService(input);
      return { success: !!result };
    }),

  getAll: publicProcedure.query(async () => {
    return await db.getAllServices();
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getServiceById(input);
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateService(input.id, input.data);
      return { success: true };
    }),
});

/**
 * Area Router
 */
const areaRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createArea(input);
    }),

  getAll: publicProcedure.query(async () => {
    return await db.getAllAreas();
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getAreaById(input);
    }),
});

/**
 * Order Router
 */
const orderRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        serviceId: z.number(),
        areaId: z.number(),
        scheduledDate: z.date(),
        customerLatitude: z.number(),
        customerLongitude: z.number(),
        customerAddress: z.string(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
        estimatedPrice: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "customer") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const orderNumber = `ORD-${Date.now()}-${nanoid(6)}`;
      const result = await db.createOrder({
        orderNumber,
        customerId: ctx.user.id,
        ...input,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "stripe",
      });

      return result;
    }),

  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const order = await db.getOrderById(input);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      // Check authorization
      if (
        ctx.user.role === "customer" &&
        order.customerId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return order;
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "customer") {
      return await db.getCustomerOrders(ctx.user.id);
    } else if (ctx.user.role === "technician") {
      return await db.getTechnicianOrders(ctx.user.id);
    }
    return [];
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "assigned", "in-progress", "completed", "cancelled"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const order = await db.getOrderById(input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      // Authorization check
      if (
        ctx.user.role === "technician" &&
        order.technicianId !== ctx.user.id
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.updateOrder(input.orderId, { status: input.status });
      await db.addOrderStatusHistory(
        input.orderId,
        input.status,
        ctx.user.id,
        input.notes
      );

      // Create notification
      const notificationUserId =
        input.status === "assigned" ? order.customerId : order.technicianId;
      if (notificationUserId) {
        await db.createNotification({
          userId: notificationUserId,
          type: "order_update",
          title: `Order Status Updated`,
          message: `Your order status has been updated to ${input.status}`,
          orderId: input.orderId,
        });
      }

      return { success: true };
    }),

  assignTechnician: adminProcedure
    .input(
      z.object({
        orderId: z.number(),
        technicianId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateOrder(input.orderId, {
        technicianId: input.technicianId,
        status: "assigned",
      });

      // Notify technician
      await db.createNotification({
        userId: input.technicianId,
        type: "order_assigned",
        title: "New Order Assigned",
        message: "A new order has been assigned to you",
        orderId: input.orderId,
      });

      return { success: true };
    }),
});

/**
 * Review Router
 */
const reviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        technicianId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        images: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "customer") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const result = await db.createReview({
        orderId: input.orderId,
        customerId: ctx.user.id,
        technicianId: input.technicianId,
        rating: input.rating,
        comment: input.comment,
        images: input.images,
      });

      // Update technician average rating
      const reviews = await db.getReviewsByTechnician(input.technicianId);
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await db.updateTechnicianProfile(input.technicianId, {
        averageRating: avgRating,
      });

      return result;
    }),

  getByTechnician: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getReviewsByTechnician(input);
    }),
});

/**
 * Payment Router
 */
const paymentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        amount: z.number(),
        method: z.enum(["stripe", "wallet", "cash"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "customer") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await db.createPayment({
        orderId: input.orderId,
        customerId: ctx.user.id,
        amount: input.amount,
        method: input.method,
        status: "pending",
      });
    }),

  getByOrderId: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getPaymentByOrderId(input);
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        paymentId: z.number(),
        status: z.enum(["pending", "completed", "failed", "refunded"]),
      })
    )
    .mutation(async ({ input }) => {
      return await db.updatePayment(input.paymentId, { status: input.status });
    }),
});

/**
 * Notification Router
 */
const notificationRouter = router({
  getMyNotifications: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      return await db.getUserNotifications(ctx.user.id, input.limit);
    }),

  markAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await db.markNotificationAsRead(input);
    }),
});

/**
 * Coupon Router
 */
const couponRouter = router({
  validate: publicProcedure
    .input(
      z.object({
        code: z.string(),
        orderAmount: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await db.validateCoupon(input.code, input.orderAmount);
    }),

  create: adminProcedure
    .input(
      z.object({
        code: z.string(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.number(),
        maxUses: z.number().optional(),
        minOrderAmount: z.number().optional(),
        expiryDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const couponData: any = { ...input };
      if (input.discountValue) couponData.discountValue = input.discountValue as any;
      return await db.createCoupon(couponData);
    })
});

/**
 * Analytics Router (for Admin Dashboard)
 */
const analyticsRouter = router({
  getDashboardStats: adminProcedure.query(async () => {
    const allUsers = await db.getAllUsers();
    const customers = allUsers.filter((u) => u.role === "customer");
    const technicians = allUsers.filter((u) => u.role === "technician");

    return {
      totalCustomers: customers.length,
      totalTechnicians: technicians.length,
      totalUsers: allUsers.length,
    };
  }),
});

/**
 * Main App Router
 */
export const appRouter = router({
  system: systemRouter,
  auth: userRouter,
  customer: customerRouter,
  technician: technicianRouter,
  service: serviceRouter,
  area: areaRouter,
  order: orderRouter,
  review: reviewRouter,
  payment: paymentRouter,
  notification: notificationRouter,
  coupon: couponRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
