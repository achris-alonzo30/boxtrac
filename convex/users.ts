import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
import { roles } from "./schema";

// ################################################################
// ##################### UTILITY FUNCTION #########################
// ################################################################

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) throw new ConvexError("User not found!");

  return user;
}

// ################################################################
// ####################### CLERK WEBHOOK ##########################
// ################################################################

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    profileImage: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { name, email, profileImage, tokenIdentifier }) => {
    await ctx.db.insert("users", {
      name,
      email,
      orgIds: [],
      profileImage,
      tokenIdentifier,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    profileImage: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, { name, email, profileImage, tokenIdentifier }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .first();

    if (!user) throw new ConvexError("User not found!");

    await ctx.db.patch(user._id, {
      name,
      email,
      profileImage,
    });
  },
});

export const addUserToOrg = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  handler: async (ctx, { tokenIdentifier, orgId, role }) => {
    const user = await getUser(ctx, tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: orgId, role: role }],
    });
  },
});

export const updateUserRoleToOrg = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  handler: async (ctx, { tokenIdentifier, orgId, role }) => {
    const user = await getUser(ctx, tokenIdentifier);

    const org = user.orgIds.find((org) => org.orgId === orgId);

    if (!org) throw new ConvexError("Organization not found!");

    org.role = role;

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds
    })
  }
})

// ################################################################
// ####################### CONVEX FUNCTIONS #######################
// ################################################################
export const getUserProfile = query({
  args: { userId: v.id("users")},
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (!user) throw new ConvexError("User not found!");

    return { 
      name: user.name,
      profileImage: user.profileImage
    }
  }
})

export const getSelf = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return null;

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) return null;

    return user;
  }
})
