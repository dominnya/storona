import { define } from "@storona/discord.js";

export default define<"message_create">(message => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong");
  }
});
