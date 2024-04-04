import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addInventory = mutation({
  args: {
    size: v.string(),
    price: v.number(),
    status: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
  },
  handler: async (
    ctx,
    { size, price, status, itemName, quantity, supplier }
  ) => {
    return await ctx.db.insert("inventory", {
      size,
      price,
      status,
      itemName,
      quantity,
      supplier,
    });
  },
});

export const getInventories = query({
    handler: async (ctx) => {
        return await ctx.db.query("inventory").collect();
    }
})
