import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: {
        userId: v.string(),
        lastName: v.string(),
        firstName: v.string(),
        emailAddress: v.string(),
    },
    handler: async (ctx, { userId, lastName, firstName, emailAddress }) => {
        await ctx.db.insert("users", {
            userId,
            lastName,
            firstName,
            emailAddress
        })
    },
})