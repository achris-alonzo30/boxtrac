import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { inventoryAccess, orgAccess } from "./inventories";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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
  },
  handler: async (
    ctx,
    {
      size,
      price,
      orgId,
      status,
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
    customer: v.optional(v.string()),
    itemName: v.optional(v.string()),
    quantity: v.optional(v.number()),
    inventoryId: v.optional(v.id("inventory")),
  },
  handler: async (
    ctx, 
    { id, size, price, status, customer, itemName, quantity, inventoryId }
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
      });

      const prevStatus = order.order.status;

      if (inventoryId) {
        await ctx.scheduler.runAfter(0, internal.inventories.updateItemQuantity, {
        status: status ? status : "skip",
        inventoryId,
        stateQuantity: quantity ? quantity : 0,
        prevStatus,
      })
      }
    
      return { success: true}
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false}
    }

    
  }
})

export const deleteOrder = mutation({
  args: {
    id: v.id("order"),
  },
  handler: async (ctx, { id }) => {
    const order = await orderDataAccess(id, ctx);

    if (!order) throw new ConvexError("[DELETE_ORDER]: Order not found");

    try {
      await ctx.db.delete(order.order._id);

      return { success: true}
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false}
    }
  }
})

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
  }
})



// ################################################################
// ##################### Utility Function #########################
// ################################################################

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
  

