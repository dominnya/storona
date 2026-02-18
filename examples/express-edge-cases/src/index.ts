import express from "express";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

const app = express();

app.use(express.json());

async function main() {
  console.log("🚀 Starting express-edge-cases example...\n");

  const routes = await createRouter(app, {
    directory: "src/routes",
    adapter: adapter(),
    quiet: false,
  });

  console.log("\n📋 Registered routes:");
  for (const route of routes) {
    if (route.registered) {
      console.log(
        `  ✅ ${route.method?.toString().toUpperCase()} ${route.endpoint}`,
      );
    } else {
      console.log(`  ❌ ${route.path} - ${route.error?.message}`);
    }
  }

  app.listen(3000, () => {
    console.log("\n🎉 Server running at http://localhost:3000");
    console.log("\nTest endpoints:");
    console.log("  curl http://localhost:3000/");
    console.log("  curl http://localhost:3000/api/users");
    console.log("  curl http://localhost:3000/api/users/123");
    console.log(
      "  curl -X POST http://localhost:3000/api/posts -H 'Content-Type: application/json' -d '{\"title\":\"test\"}'",
    );
  });
}

main().catch(console.error);
