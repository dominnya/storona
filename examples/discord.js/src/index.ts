import { Client, GatewayIntentBits } from "discord.js";
import { createRouter } from "storona";
import { adapter } from "@storona/discord.js";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is not provided");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await createRouter(client, {
  directory: "src/routes",
  adapter: adapter({
    registerCommands: true,
  }),
});

await client.login(token);
