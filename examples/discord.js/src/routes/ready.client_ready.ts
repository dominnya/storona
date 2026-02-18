import { define } from "@storona/discord.js";

export default define<"client_ready">(client => {
  console.info(`Logged in as ${client.user?.tag ?? "unknown"}`);
});
