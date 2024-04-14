import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, query } from "./_generated/server";

export const createLog = internalMutation({
  args: {
    orgId: v.string(),
    action: v.string(),
    orderId: v.optional(v.id("order")),
    inventoryId: v.optional(v.id("inventory")),
    dataType: v.optional(v.union(v.literal("Inventory"), v.literal("Order"))),
  },
  handler: async (ctx, { orgId, action, orderId, inventoryId, dataType }) => {
    let orderData;
    let inventoryData;
    if (inventoryId) {
      inventoryData = await ctx.db.get(inventoryId);
    }

    if (orderId) {
      orderData = await ctx.db.get(orderId);
    }

    if (!inventoryData || !orderData)
      throw new ConvexError("[CREATE_LOG]: Inventory not found");

    return await ctx.db.insert("logs", {
      orgId,
      action,
      data: {
        inventoryData,
        dataType,
        orderData,
      },
    });
  },
});

export const getAllLogs = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);
    if (!hasAccess) return null;

    return await ctx.db
        .query("logs")
        .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
        .collect();
  },
});

export const getLog = query({
  args: {
    logId: v.id("logs"),
    orgId: v.string(),
  },
  handler: async (ctx, { logId, orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);
    if (!hasAccess) return null;
    return await ctx.db.get(logId);
  }
})


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