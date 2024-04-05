import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";


export const roles = v.optional(
  v.union(v.literal("admin"), v.literal("staff"))
);

export const dataType = v.optional(
  v.union(v.literal("Inventory"), v.literal("Order"))
);

export const item = v.object({
  _id: v.id("inventory"),
  _creationTime: v.number(),
  orgId: v.string(),
  size: v.string(),
  price: v.number(),
  status: v.string(),
  itemName: v.string(),
  quantity: v.number(),
  supplier: v.string(),
  requestForEdit: v.optional(v.boolean()),
  requestForDeletion: v.optional(v.boolean()),
});

export const inventoryData = v.optional(
  v.object({
    size: v.string(),
    price: v.number(),
    status: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    requestForEdit: v.optional(v.boolean()),
    requestForDeletion: v.optional(v.boolean()),
  })
);

export const orderData = v.optional(
  v.object({
    size: v.string(),
    price: v.number(),
    orgId: v.string(),
    status: v.string(),
    customer: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    inventoryId: v.optional(v.id("_storage")),
    requestForEdit: v.optional(v.boolean()),
    requestForDeletion: v.optional(v.boolean()),
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
    requestForEdit: v.optional(v.boolean()),
    requestForDeletion: v.optional(v.boolean()),
  })
    .index("byOrgId", ["orgId"])
    .index("byMarkedForDeletion", ["requestForDeletion"])
    .index("byMarkedForEdit", ["requestForEdit"]),

  order: defineTable({
    size: v.string(),
    price: v.number(),
    orgId: v.string(),
    status: v.string(),
    customer: v.string(),
    itemName: v.string(),
    quantity: v.number(),
    supplier: v.string(),
    inventoryId: v.optional(v.id("_storage")),
    requestForEdit: v.optional(v.boolean()),
    requestForDeletion: v.optional(v.boolean()),
  })
    .index("byOrgId", ["orgId"])
    .index("byMarkedForDeletion", ["requestForDeletion"])
    .index("byMarkedForEdit", ["requestForEdit"]),

  logs: defineTable({
    orgId: v.string(),
    action: v.string(),
    item: item,
  }),

  stagingArea: defineTable({
    orgId: v.string(),
    action: v.string(),
    data: v.object({
      dataType: dataType,
      orderData: orderData,
      inventoryData: inventoryData,
    }),
  }).index("byOrgId", ["orgId"]),

});
