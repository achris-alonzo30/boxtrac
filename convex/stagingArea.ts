import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { dataType, inventoryData, orderData } from "./schema";

export const addToStagingArea = mutation({
  args: {
    orgId: v.string(),
    action: v.string(),
    data: v.object({
      dataType: dataType,
      inventoryData: inventoryData,
      orderData: orderData,
    }),
    inventoryId: v.optional(v.id("inventory")),
    orderId: v.optional(v.id("order")),
  },
  handler: async (ctx, { orgId, action, data, inventoryId, orderId }) => {
    console.log(orgId)
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess)
      throw new ConvexError(
        "[ADD_TO_STAGING_AREA] You do not have access to this organization"
      );

    return await ctx.db.insert("stagingArea", {
      orgId,
      action,
      data,
      inventoryId,
      orderId
    });
  },
});

export const getItemsInStagingArea = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess)
      throw new ConvexError(
        "[GET_ITEMS_IN_STAGING_AREA] You do not have access to this organization"
      );

    return await ctx.db
      .query("stagingArea")
      .withIndex("byOrgId", (q) =>
        q.eq("orgId", orgId)
      )
      .collect();
  },
});

export const getNumberOfRequests = query({
  args: { orgId: v.string(), },
  handler: async (ctx, { orgId }) => {
    const res = await ctx.db
      .query("stagingArea")
      .withIndex("byOrgId", (q) =>
        q.eq("orgId", orgId)
      )
      .collect();

    return res.length;
  }
})

export const clear = mutation({
  args: {
    itemId: v.id("stagingArea"),
  },
  handler: async (ctx, { itemId }) => {
    const itemToDelete = await ctx.db.get(itemId);

    if (!itemToDelete) throw new ConvexError("[CLEAR]: Item not found");

    try {
      await ctx.db.delete(itemId)

      return { success: true}
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false}
    }
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
