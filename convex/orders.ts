import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  currentMonthEnd,
  currentMonthStart,
  currentWeekEnd,
  currentWeekStart,
  currentYearEnd,
  currentYearStart,
} from "@/lib/utils";

// ################################################################
// ######################## Mutations #############################
// ################################################################

export const addNewOrder = mutation({
  args: {
    size: v.string(),
    price: v.number(),
    orgId: v.string(),
    status: v.string(),
    customer: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    inventoryId: v.id("inventory"),
    isStaff: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    {
      size,
      price,
      orgId,
      status,
      isStaff,
      customer,
      itemName,
      quantity,
      supplier,
      inventoryId,
    }
  ) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess)
      throw new ConvexError(
        "[ADD_ORDER]: You do not have access to this organization"
      );

    const res = await ctx.db.insert("order", {
      size,
      price,
      orgId,
      status,
      customer,
      itemName,
      quantity,
      supplier,
    });

    const item = await ctx.db.get(inventoryId);

    if (!item || !res) return null;

    const updatedQuantity = item.quantity - quantity;

    if (res && status === "Fulfilled") {
      await ctx.db.patch(item._id, {
        quantity: updatedQuantity,
      });
    }

    if (res) {
      if (isStaff) {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[STAFF]: Request to Add an Order",
          orderId: res,
          dataType: "Order",
          orgId,
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[ADMIN]: Create New Order",
          orderId: res,
          dataType: "Order",
          orgId,
        });
      }

      return { status: "complete" };
    }
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("order"),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.string()),
    isStaff: v.optional(v.boolean()),
    customer: v.optional(v.string()),
    itemName: v.optional(v.string()),
    quantity: v.optional(v.number()),
    supplier: v.optional(v.string()),
    inventoryId: v.optional(v.id("inventory")),
  },
  handler: async (
    ctx,
    {
      id,
      size,
      price,
      status,
      customer,
      itemName,
      quantity,
      supplier,
      inventoryId,
      isStaff,
    }
  ) => {
    const order = await orderDataAccess(id, ctx);

    if (!order) throw new ConvexError("[UPDATE_ORDER]: Order not found");

    try {
      await ctx.db.patch(order.order._id, {
        size,
        price,
        status,
        customer,
        itemName,
        quantity,
        supplier,
      });

      const prevStatus = order.order.status;
      const refunded =
        prevStatus === "Fulfilled" &&
        (status === "Refunded" ||
          status === "Pending" ||
          status === "Cancelled");
      const fulfilled =
        (prevStatus === "Pending" ||
          prevStatus === "Refunded" ||
          prevStatus === "Cancelled") &&
        status === "Fulfilled";

      if (inventoryId && (refunded || fulfilled)) {
        await ctx.scheduler.runAfter(
          0,
          internal.inventories.updateItemQuantity,
          {
            refunded,
            fulfilled,
            inventoryId,
            stateQuantity: quantity ? quantity : 0,
          }
        );
      }

      if (isStaff) {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[STAFF]: Request to Update Order",
          orderId: id,
          dataType: "Order",
          orgId: order.order.orgId,
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[ADMIN]: Update Order",
          orderId: id,
          dataType: "Order",
          orgId: order.order.orgId,
        });
      }

      return { success: true };
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false };
    }
  },
});

export const deleteOrder = mutation({
  args: {
    id: v.id("order"),
    isStaff: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, isStaff }) => {
    const order = await orderDataAccess(id, ctx);

    if (!order) throw new ConvexError("[DELETE_ORDER]: Order not found");

    try {
      await ctx.db.delete(order.order._id);

      if (isStaff) {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[STAFF]: Request to Delete Order",
          orderId: id,
          dataType: "Order",
          orgId: order.order.orgId,
        });
      } else {
        await ctx.scheduler.runAfter(0, internal.logs.createLog, {
          action: "[ADMIN]: Delete Order",
          orderId: id,
          dataType: "Order",
          orgId: order.order.orgId,
        });
      }

      return { success: true };
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false };
    }
  },
});

// ################################################################
// ######################### Queries ##############################
// ################################################################

export const getOrders = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess) return [];

    return await ctx.db
      .query("order")
      .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const orderToEdit = query({
  args: { orderId: v.id("order") },
  handler: async (ctx, { orderId }) => {
    const order = await orderDataAccess(orderId, ctx);

    if (!order) throw new ConvexError("[EDIT_ORDER]: Order not found");

    return await ctx.db.get(order.order._id);
  },
});

export const getTotalOrders = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) return null;

    const hasAccess =
      user.orgIds.some((id) => id.orgId === orgId) ||
      user.tokenIdentifier.includes(orgId);

    if (!hasAccess) return null;

    const orders = await ctx.db
      .query("order")
      .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
      .collect();

    if (!orders) return [];

    // *************************** WEEKLY ORDERS *************************** \\
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(currentWeekEnd);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

    const curWeeklyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= currentWeekStart &&
        orderCreationTime <= currentWeekEnd
      );
    });

    const prevWeeklyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= prevWeekStart && orderCreationTime <= prevWeekEnd
      );
    });

    // *************************** MONTHLY ORDERS *************************** \\
    const prevMonthStart = new Date(currentMonthStart);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(currentMonthEnd);
    prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);

    const curMonthlyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= currentMonthStart &&
        orderCreationTime <= currentMonthEnd
      );
    });

    const prevMonthlyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= prevMonthStart && orderCreationTime <= prevMonthEnd
      );
    });

    // *************************** YEARLY ORDERS *************************** \\
    const prevYearStart = new Date(currentYearStart);
    prevYearStart.setFullYear(prevYearStart.getFullYear() - 1);
    const prevYearEnd = new Date(currentYearEnd);
    prevYearEnd.setFullYear(prevYearEnd.getFullYear() - 1);

    const curYearlyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= currentYearStart &&
        orderCreationTime <= currentYearEnd
      );
    });

    const prevYearlyOrders = orders.filter((order) => {
      const orderCreationTime = new Date(order._creationTime);
      return (
        orderCreationTime >= prevYearStart && orderCreationTime <= prevYearEnd
      );
    });

    // *************************** WEEKLY PROFIT *************************** \\
    const curWeeklyProfit = curWeeklyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    const prevWeeklyProfit = prevWeeklyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    let weeklyPercentChange = 0;
    if (prevWeeklyProfit > 0) {
      weeklyPercentChange =
        ((curWeeklyProfit - prevWeeklyProfit) / prevWeeklyProfit) * 100;
    } else {
      weeklyPercentChange = 100;
    }

    // *************************** MONTHLY PROFIT *************************** \\
    const curMonthlyProfit = curMonthlyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    const prevMonthlyProfit = prevMonthlyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    let monthlyPercentChange = 0;
    if (prevMonthlyProfit > 0) {
      monthlyPercentChange =
        ((curMonthlyProfit - prevMonthlyProfit) / prevMonthlyProfit) * 100;
    } else {
      monthlyPercentChange = 100;
    }

    // *************************** YEARLY PROFIT *************************** \\
    const curYearlyProfit = curYearlyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    const prevYearlyProfit = prevYearlyOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );

    let yearlyPercentChange = 0;
    if (prevYearlyProfit > 0) {
      yearlyPercentChange =
        ((curYearlyProfit - prevYearlyProfit) / prevYearlyProfit) * 100;
    } else {
      yearlyPercentChange = 100;
    }

    return {
      curWeeklyProfit,
      curMonthlyProfit,
      curYearlyProfit,
      weeklyPercentChange,
      monthlyPercentChange,
      yearlyPercentChange,
    };
  },
});

export const getBestSellers = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess) return [];

    const orders = await ctx.db
      .query("order")
      .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
      .collect();

    const aggregatedOrders = orders.reduce<{ [itemName: string]: number }>(
      (acc, order) => {
        if (order.status === "Fulfilled") {
          const itemName = order.itemName;
          if (!acc[itemName]) {
            acc[itemName] = 0;
          }

          acc[itemName]++;
        }
        return acc;
      },
      {}
    );

    const itemWithTransactionCount = Object.entries(aggregatedOrders).map(
      ([itemName, transactionCount]) => {
        return { itemName, transactionCount };
      }
    );
    console.log(itemWithTransactionCount);

    const bestSellers = itemWithTransactionCount
      .sort((a, b) => b.transactionCount - a.transactionCount)
      .slice(0, 10);

    return bestSellers;
  },
});

export const getOrdersData = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const orders = await ctx.db
      .query("order")
      .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
      .collect();

    const totalValueOrders = orders.reduce((acc, order) => {
      if (order.status === "Fulfilled") {
        return acc += order.price * order.quantity;
      }
      return acc;
    }, 0)
  },
});

// ################################################################
// ##################### Utility Function #########################
// ################################################################

export async function orgAccess(orgId: string, ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) return null;

  // The user has access if either the user orgId is the orgId or if the user is in the org
  const hasAccess =
    user.orgIds.some((id) => id.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) return null;

  return { user };
}

export async function orderDataAccess(
  orderId: Id<"order">,
  ctx: QueryCtx | MutationCtx
) {
  const order = await ctx.db.get(orderId);

  if (!order) return null;

  const hasAccess = await orgAccess(order.orgId, ctx);

  if (!hasAccess) return null;

  return { user: hasAccess.user, order };
}
