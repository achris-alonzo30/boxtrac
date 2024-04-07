import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// ################################################################
// ######################## Mutations #############################
// ################################################################

export const addItemToInventory = mutation({
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
      throw new ConvexError("[ADD_INVENTORY] You do not have access to this organization");

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

      return { status: "complete"}
    } 

  },
});

export const updateItemToInventory = mutation({
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
    const item = await inventoryAccess(id, ctx);

    if (!item) throw new ConvexError("[UPDATE_INVENTORY]: Inventory not found");
    
    try {
      await ctx.db.patch(item.item._id, {
        size,
        price,
        status,
        itemName,
        quantity,
        supplier,
      });
      return { success: true}
    } catch(error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false}
    }
  },
});

export const deleteItemToInventory = mutation({
  args: {
    itemId: v.id("inventory"),
  },
  handler: async (ctx, { itemId }) => {
    const item = await inventoryAccess(itemId, ctx);

    if (!item) throw new ConvexError("[DELETE_INVENTORY]: Inventory not found");

    try {
      await ctx.db.delete(item.item._id);

      return { success: true};
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      return { success: false}
    }

  }
});

export const updateItemQuantity = internalMutation({
  args: {
    inventoryId: v.id("inventory"),
    stateQuantity: v.number(),
    refunded: v.boolean(),
    fulfilled: v.boolean(),
  },
  handler: async (ctx, { inventoryId, stateQuantity, refunded, fulfilled } ) => {
    const item = await ctx.db.get(inventoryId);

    if (!item) return null;
    
    try {
      if (refunded) {
        const quantity = item.quantity + stateQuantity;
        await ctx.db.patch(item?._id, {
          quantity
        })
      }

      if (fulfilled) {
        const quantity = item.quantity - stateQuantity;
        await ctx.db.patch(item._id, {
          quantity
        })
      }

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
    const item = await inventoryAccess(itemId, ctx);

    if (!item) throw new ConvexError("[ITEM_TO_EDIT]: Inventory not found");

    return await ctx.db.get(item.item._id);
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
