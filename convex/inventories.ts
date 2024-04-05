import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// ################################################################
// ######################## MUTATIONS #############################
// ################################################################

export const addInventory = mutation({
  args: {
    size: v.string(),
    orgId: v.string(),
    price: v.number(),
    status: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
  },
  handler: async (
    ctx,
    { size, orgId, price, status, itemName, quantity, supplier }
  ) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess)
      throw new ConvexError("You do not have access to this organization");

    const inventoryId = await ctx.db.insert("inventory", {
      size,
      price,
      orgId,
      status,
      itemName,
      quantity,
      supplier,
    });

    if (inventoryId) {
      await ctx.scheduler.runAfter(0, internal.logs.createLog, {
        orgId,
        action: "Add New Item in Inventory",
        inventoryId,
      })
    }
  },
});

export const updateInventory = mutation({
  args: {
    id: v.id("inventory"),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.string()),
    itemName: v.optional(v.string()),
    quantity: v.optional(v.number()),
    supplier: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { id, size, price, status, itemName, quantity, supplier }
  ) => {
    return await ctx.db.patch(id, {
      size,
      price,
      status,
      itemName,
      quantity,
      supplier,
    });
  },
});

// ################################################################
// ######################### Queries ##############################
// ################################################################

export const getInventories = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const hasAccess = await orgAccess(orgId, ctx);

    if (!hasAccess) return [];

    return await ctx.db
      .query("inventory")
      .withIndex("byOrgId", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const itemToEdit = query({
  args: { itemId: v.id("inventory") },
  handler: async (ctx, { itemId }) => {
    return await ctx.db.get(itemId);
  },
});

// ################################################################
// #################### Utility Functions #########################
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

export async function inventoryAccess(
  inventoryId: Id<"inventory">,
  ctx: QueryCtx | MutationCtx
) {
  const item = await ctx.db.get(inventoryId);

  if (!item) return null;

  const hasAccess = await orgAccess(item.orgId, ctx);

  if (!hasAccess) return null;

  return { user: hasAccess.user, item };
}
