import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { posts, postUnlocks } from "../database/schema";
import { eq, and } from "drizzle-orm";

export const postsRoutes = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { user: { id: string } | null; session: unknown };
}>();

postsRoutes.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const allPosts = await db.select().from(posts).orderBy(posts.createdAt);
  const user = c.get("user");

  return c.json({
    posts: allPosts.map((p) => ({
      ...p,
      locked: p.tier !== "free" && !user,
    })),
    user: user ? { id: user.id } : null,
  });
});

postsRoutes.get("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const post = await db.select().from(posts).where(eq(posts.id, c.req.param("id"))).get();
  if (!post) return c.json({ error: "Not found" }, 404);

  const user = c.get("user");
  let unlocked = post.tier === "free";

  if (user && post.tier === "ppv") {
    const unlock = await db
      .select()
      .from(postUnlocks)
      .where(and(eq(postUnlocks.userId, user.id), eq(postUnlocks.postId, post.id)))
      .get();
    unlocked = !!unlock;
  } else if (user && post.tier === "subscriber") {
    unlocked = true; // In real app, check subscription status
  }

  return c.json({ post, unlocked });
});

// Seed initial posts (admin only in prod)
postsRoutes.post("/seed", async (c) => {
  const db = drizzle(c.env.DB);
  const now = new Date();

  const samplePosts = [
    {
      id: "post-1",
      title: "MORNING ROSES",
      description: "Just woke up thinking about you... 🌹",
      imageUrl: "/model-content-1.png",
      tier: "free" as const,
      ppvPrice: null,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      likes: 342,
      category: "photo",
    },
    {
      id: "post-2",
      title: "SILK & ROSES",
      description: "My favorite Sunday look... do you like it? 💋",
      imageUrl: "/model-content-2.png",
      tier: "subscriber" as const,
      ppvPrice: null,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      likes: 891,
      category: "photo",
    },
    {
      id: "post-3",
      title: "GOLDEN HOUR",
      description: "This light was magical. I had to share it with you 🌸",
      imageUrl: "/model-content-3.png",
      tier: "subscriber" as const,
      ppvPrice: null,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      likes: 1204,
      category: "photo",
    },
    {
      id: "post-4",
      title: "EXCLUSIVE: PETALS",
      description: "Something very special, just for you darling ✨",
      imageUrl: "/model-content-4.png",
      tier: "ppv" as const,
      ppvPrice: 9.99,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      likes: 2103,
      category: "exclusive",
    },
    {
      id: "post-5",
      title: "RED ROSE",
      description: "A rose for my favorite person... 🥀",
      imageUrl: "/model-content-5.png",
      tier: "ppv" as const,
      ppvPrice: 14.99,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      likes: 3456,
      category: "exclusive",
    },
  ];

  for (const post of samplePosts) {
    await db.insert(posts).values(post).onConflictDoNothing();
  }

  return c.json({ success: true, count: samplePosts.length });
});
