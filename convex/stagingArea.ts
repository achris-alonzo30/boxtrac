import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { dataType, inventoryData, orderData } from "./schema";
import { orgAccess } from "./inventories";

export const addToStagingArea = mutation({
  args: {
    orgId: v.string(),
    action: v.string(),
    data: v.object({
      dataType: dataType,
      inventoryData: inventoryData,
      orderData: orderData,
    }),
  },
  handler: async (ctx, { orgId, action, data }) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess)
      throw new ConvexError(
        "[ADD_TO_STAGING_AREA] You do not have access to this organization"
      );

    return await ctx.db.insert("stagingArea", {
      orgId,
      action,
      data,
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
