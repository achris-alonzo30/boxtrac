import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { orgAccess } from "./inventories";
import { internal } from "./_generated/api";

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

    if (res) {
      await ctx.scheduler.runAfter(
        0,
        internal.inventories.updateItemAfterOrder,
        {
          id: inventoryId,
          quantity,
        }
      );

      return { status: "complete" };
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
