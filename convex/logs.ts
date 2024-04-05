import { ConvexError, v } from "convex/values";
import { orgAccess, inventoryAccess } from "./inventories";
import { internalMutation } from "./_generated/server";


export const createLog = internalMutation({
    args: {
        orgId: v.string(),
        action: v.string(),
        inventoryId: v.id("inventory")
    },
    handler: async (ctx, { orgId, action, inventoryId}) => {
        const hasAccess = await orgAccess(orgId, ctx);

        if (!hasAccess) throw new ConvexError("[CREATE_LOG]: You do not have access to this organization");

        const item = await ctx.db.get(inventoryId);

        if (!item) throw new ConvexError("[CREATE_LOG]: Inventory not found");

        return await ctx.db.insert("logs", {
            orgId,
            action,
            item
        })
    }
})