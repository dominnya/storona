import { define } from "@storona/discord.js";
import { ApplicationCommandOptionType } from "discord.js";

export const description = "Post an announcement";
export const guildOnly = ["736340138489151558"];
export const options = [
  {
    type: ApplicationCommandOptionType.String,
    name: "message",
    description: "Announcement text",
    required: true,
  },
];

export default define<"command">(interaction => {
  const message = interaction.options.getString("message", true);

  interaction.reply({
    content: `Announcement: ${message}`,
    ephemeral: true,
  });
});
