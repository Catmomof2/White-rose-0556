import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import { authMiddleware } from "./middleware/authentication";
import { agentRoutes } from "./routes/agent";
import { postsRoutes } from "./routes/posts";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { user: { id: string; name: string; email: string } | null; session: unknown };
}>().basePath("api");

app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Better Auth — handle all auth routes
app.all("/auth/*", async (c) => {
  const auth = createAuth(`${new URL(c.req.url).protocol}//${new URL(c.req.url).host}`);
  return auth.handler(c.req.raw);
});

// Apply auth middleware globally
app.use(authMiddleware);

app.get("/ping", (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Current user
app.get("/me", (c) => {
  const user = c.get("user");
  return c.json({ user });
});

app.route("/agent", agentRoutes);
app.route("/posts", postsRoutes);

export default app;
