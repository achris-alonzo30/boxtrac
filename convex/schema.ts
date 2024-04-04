import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export const roles = v.optional(v.union(v.literal("admin"), v.literal("staff")));

export default defineSchema({
    users: defineTable({
        role: roles,
        userId: v.string(),
        lastName: v.string(),
        firstName: v.string(),
        emailAddress: v.string(),
    }),
    inventory: defineTable({
        size: v.string(),
        price: v.number(),
        status: v.string(),
        itemName: v.string(),
        quantity: v.number(),
        supplier: v.string(),
    }),
    order: defineTable({
        size: v.string(),
        price: v.number(),
        status: v.string(),
        customer: v.string(),
        itemName: v.string(),
        quantity: v.number(),
        supplier: v.string(),
        inventoryId: v.optional(v.id("_storage")),
    }),
})