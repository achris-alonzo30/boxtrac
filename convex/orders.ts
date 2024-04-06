import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { orgAccess } from "./inventories";
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
    console.log("Result", res)
    const item = await ctx.db.get(inventoryId);
    console.log("Item", item)
    if (!item || !res) return null;

    const updatedQuantity = item.quantity - quantity;
    console.log("Updated Quantity", updatedQuantity)
    if (res) {
      await ctx.db.patch(item._id, {
        quantity: updatedQuantity,
      });

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
    supplier: v.optional(v.string()),
  },
  handler: async (
    ctx, 
    { id, size, price, status, customer, itemName, quantity, supplier }
  ) => {
    const order = await orderDataAccess(id, ctx);

    if (!order) throw new ConvexError("[UPDATE_ORDER]: Order not found");

    try {
      await ctx.db.patch(id, {
        size,
        price,
        status,
        customer,
        itemName,
        quantity,
        supplier,
      });

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
  

