import { define } from "@storona/discord.js";
import { ApplicationCommandOptionType } from "discord.js";

export const description = "Replies with Pong";
export const options = [
  {
    type: ApplicationCommandOptionType.String,
    name: "text",
    description: "Optional message to include",
    required: false,
  },
];

export default define<"command">(interaction => {
  const text = interaction.options.getString("text");
  const reply = text ? `Pong: ${text}` : "Pong";

  interaction.reply(reply);
});
