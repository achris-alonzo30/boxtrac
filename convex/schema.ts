import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";


export const roles = v.optional(
  v.union(v.literal("admin"), v.literal("staff"))
);

export const dataType = v.optional(
  v.union(v.literal("Inventory"), v.literal("Order"))
);


export const inventoryData = v.optional(
  v.object({
    size: v.string(),
    price: v.number(),
    status: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
  })
);

export const orderData = v.optional(
  v.object({
    size: v.string(),
    price: v.number(),
    status: v.string(),
    customer: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
  })
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
    profileImage: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  inventory: defineTable({
    size: v.string(),
    orgId: v.string(),
    price: v.number(),
    status: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    orderCount: v.optional(v.number()),
  })
    .index("byOrgId", ["orgId"]),

  order: defineTable({
    size: v.string(),
    price: v.number(),
    orgId: v.string(),
    status: v.string(),
    customer: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
  })
    .index("byOrgId", ["orgId"]),

  logs: defineTable({
    orgId: v.string(),
    action: v.string(),
    data: v.object({
      dataType: dataType,
      orderData: orderData,
      inventoryData: inventoryData,
    }),
  }).index("byOrgId", ["orgId"]),

  stagingArea: defineTable({
    orgId: v.string(),
    action: v.string(),
    data: v.object({
      dataType: dataType,
      orderData: orderData,
      inventoryData: inventoryData,
    }),
    inventoryId: v.optional(v.id("inventory")),
    orderId: v.optional(v.id("order")),
  }).index("byOrgId", ["orgId"]),

});
